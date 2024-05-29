import { hosting, co2 } from "@tgwf/co2"

export class PerfTracker {
  #page = null
  #transferSizeData = []
  #summaryData = []
  #transferSizeInKiloBytes = 0
  #timeToRender = {}    
  #estimatedCO2 = 0
  
  constructor(page) {
    this.#page = page
  }

  get page() {
    return this.#page
  }

  get transferSizeData() {
    return this.#transferSizeData
  }

  get summaryData() {
    return this.#summaryData
  }

  get transferSizeInKiloBytes() {
    return this.#transferSizeInKiloBytes
  }

  set transferSizeInKiloBytes(bytes) {
    this.#transferSizeInKiloBytes = bytes
  }

  get timeToRender() {
    return this.#timeToRender
  }

  set timeToRender(time) {
    this.#timeToRender = time
  }

  get estimatedCO2() {
    return this.#estimatedCO2
  }

  set estimatedCO2(CO2) {
    this.#estimatedCO2 = CO2
  }

  async logBytes({comments}) {

    const perfEntries = JSON.parse(
      await this.page.evaluate(() => JSON.stringify(performance.getEntries()))
    )
  
    perfEntries.forEach(entry => {
      if(entry.transferSize !== undefined && entry.transferSize > 0) {
        this.transferSizeData.push({
            entryType: entry.entryType
          , transferSize: Number.parseFloat(entry.transferSize).toFixed(0)
          , transferSizeInKiloBytes: Math.round(entry.transferSize / 1000)
          , comments
        })
      }
    })
  }

  async logImageBytes({methods = ['GET', 'POST'], srcs = []}) {
    this.page.on('response', async (response) => {
      if (methods.includes(response.request().method())) {
        const url = response.request().url()
        if(srcs.find(src => url.indexOf(src) > -1 )){
          if (response.request().resourceType() === 'image' && response.status() === 200) {
            const buffer = await response.buffer()
            this.transferSizeData.push({
              entryType: 'images'
            , transferSize: (buffer.length).toFixed(2)
            , transferSizeInKiloBytes: buffer.length / 1000
            , comments: url
          })
          }
        }
      }
    })
  }

  printPerformanceEntries() {
    performance.getEntries().forEach((entry) => {
      if (entry.entryType === "mark") {
        console.log(`${entry.name} time: ${Number.parseFloat(entry.startTime).toFixed(2)}`)
      }
      if (entry.entryType === "measure") {
        console.log(`${entry.name}'s duration: ${Number.parseFloat(entry.duration).toFixed(2)}`)
      }
    })
  }

  logEmissions({totalBytes}) {
    const co2Emission = new co2()
    this.estimatedCO2 = Math.round(co2Emission.perByte(totalBytes * 1000, true) * 100) / 100
  }

  printSummary({printTranserSizes = false}) {
    const totalBytes = this.transferSizeData.reduce((accumulator, currentValue) => accumulator + Math.round(currentValue.transferSizeInKiloBytes), 0)
    
    this.summaryData.push({
      metric: 'Total transfer size in kBs'
    , value: totalBytes
    })

    this.logEmissions({totalBytes})

    this.summaryData.push({
        metric: 'Carbon emitted per page load in mg'
      , value: this.estimatedCO2
    })

    this.summaryData.push({
        metric: 'Time to render in seconds'
      , value: Number(this.timeToRender.duration.toFixed(2))
    })
    
    if(printTranserSizes) console.table(this.transferSizeData)

    console.table(this.summaryData)
  }
}