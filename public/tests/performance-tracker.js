import { hosting, co2, averageIntensity, marginalIntensity } from "@tgwf/co2"

// See https://sustainablewebdesign.org/estimating-digital-emissions/ for @tgwf/co2

export class PerformanceTracker {
  #page = null
  #options = {}
  #byteOptions = {}
  #visitOptions = {}
  #transferSizeData = []
  #summaryData = []
  #transferSizeInKiloBytes = 0
  #timeToRender = {}    
  #emissionsPerByte = null
  #emissionsPerVisit = null
  #byteTrace = null
  #visitTrace = null
  #hosting = {}
  
  constructor({page, options, byteOptions, visitOptions}) {
    this.#page = page
    this.#options = options
    this.#byteOptions = byteOptions
    this.#visitOptions = visitOptions
  }

  get page() {
    return this.#page
  }

  get options() {
    return this.#options
  }

  get byteOptions() {
    return this.#byteOptions
  }

  set byteOptions(options) {
    this.#byteOptions = options
  }

  get visitOptions() {
    return this.#visitOptions
  }

  set visitOptions(options) {
    this.#visitOptions = options
  }

  get domain() {
    return this.#options.domain
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

  get emissionsPerByte() {
    return this.#emissionsPerByte
  }
  
  set emissionsPerByte(emissions) {
    this.#emissionsPerByte = emissions
  }

  get emissionsPerVisit() {
    return this.#emissionsPerVisit
  }
  
  set emissionsPerVisit(emissions) {
    this.#emissionsPerVisit = emissions
  }

  get byteTrace() {
    return this.#byteTrace
  }

  set byteTrace(emissions) {
    this.#byteTrace = emissions
  }

  get visitTrace() {
    return this.#visitTrace
  }

  set visitTrace(emissions) {
    this.#visitTrace = emissions
  }

  get hosting() {
    return this.#hosting
  }

  set hosting(hosting) {
    this.#hosting = hosting
  }

  async logEntries({comments}) {
    const perfEntries = JSON.parse(
      await this.page.evaluate(() => JSON.stringify(performance.getEntries()))
    )
  
    // Log entries with transfer size (that is greater than zero)
    perfEntries.forEach(entry => {
      if(entry.transferSize > 0) {
        this.transferSizeData.push({
            entryType: entry.entryType
          , transferSize: Number.parseFloat(entry.transferSize).toFixed(0)
          , transferSizeInKiloBytes: Math.round(entry.transferSize / 1000)
          , comments
        })
      }
    })
  }

  async logResources({methods = ['GET', 'POST'], srcs = [], logTypes = ['image'], logStatuses = [200]}) {
    this.page.on('response', async (response) => {

      const url = response.request().url()
      const resourceType = response.request().resourceType()

      // Check resource is one we want to measure
      const isValidMethod = methods.includes(response.request().method())
      const isValidSrc = srcs.length ? srcs.some(src => url.includes(src)) : true
      const isValidStatus = logStatuses.length ? logStatuses.includes(response.status()) : true
      const isValidType = logTypes.length ? logTypes.includes(resourceType) : true
      const isValidResource = isValidMethod && isValidSrc && isValidType && isValidStatus

      if(!isValidResource) return

      switch(resourceType) {
        case 'image':
          const buffer = await response.buffer()
          this.transferSizeData.push({
              entryType: resourceType
            , transferSize: (buffer.length).toFixed(2)
            , transferSizeInKiloBytes: buffer.length / 1000
            , comments: url
        })
        break
      }   
    })
  }

  logPerByte({totalBytes, bySegment = false}) {
    const co2Emission = bySegment ? new co2({ results: "segment" }) : new co2()
    this.emissionsPerByte = co2Emission.perByte(totalBytes * 1000, true)
  }

  logPerVisit({totalBytes, bySegment = false}) {
    const co2Emission = bySegment ? new co2({ results: "segment" }) : new co2()
    this.emissionsPerVisit = co2Emission.perVisit(totalBytes * 1000, true)
  }

  logPerByteTrace({bytes, green = false, options}) {
    if(bytes) {
      const co2Emission = new co2()
      this.byteTrace = co2Emission.perByteTrace(bytes, green, options)
    }
  }

  logPerVisitTrace({bytes, green = false, options}) {
    if(bytes) {
      const co2Emission = new co2()
      this.visitTrace = co2Emission.perVisitTrace(bytes, green, options)
    }
  }

  async checkHosting({domain = '', verbose = true, identifier = ''}) {
    if(!domain.length) return { hosted_by: 'unknown', green: false }

    const options = {
        verbose
      , userAgentIdentifier: identifier,
    }

    this.hosting = await hosting.check(domain, options)
  }

  async printSummary({printTransferSizes = false}) {
    const totalBytes = this.transferSizeData.reduce((accumulator, currentValue) => accumulator + Math.round(currentValue.transferSizeInKiloBytes), 0)
    
    this.summaryData.push({
      metric: 'Total transfer size in kBs'
    , value: totalBytes
    })

    // Get country specific grid intensity
    const { data, type, year } = averageIntensity
    const { data: miData, type: miType, year: miYear } = marginalIntensity
    
    this.byteOptions.gridIntensity = this.visitOptions.gridIntensity = data[this.options.countryCode]
    this.log({
        title: 'Grid intensity'
      , data: [{
            coutryCode: this.options.countryCode
          , gridIntensity: this.byteOptions.gridIntensity
        }]
      , logger: this.options.logger
    })

    this.logPerByte({totalBytes})

    this.summaryData.push({
        metric: 'Carbon emitted per page load in mg'
      , value: this.emissionsPerByte
    })

    this.logPerByte({totalBytes, bySegment: true})

    this.log({
        title: 'Emissions per byte'
      , data: this.emissionsPerByte
      , logger: this.options.logger
    })

    this.logPerVisit({totalBytes})

    this.summaryData.push({
        metric: 'Carbon emitted per page load in mg by segment'
      , value: this.emissionsPerVisit
    })

    this.logPerVisit({totalBytes, bySegment: true})
    this.log({
        title: 'Emissions per visit'
      , data: this.emissionsPerVisit
      , logger: this.options.logger
    })

    if(this.byteOptions) {
      this.logPerByteTrace({
          bytes: totalBytes
        , green: true
        , options: this.byteOptions
      })

      this.log({
          title: 'Byte trace: grid intensity'
        , data: this.byteTrace.variables.gridIntensity
        , logger: this.options.logger
      })
    }

    if(this.visitOptions) {
      this.logPerVisitTrace({
          bytes: totalBytes
        , green: true
        , options: this.visitOptions
      })

      this.log({
          title: 'Visit trace: grid intensity'
        , data: this.visitTrace.variables.gridIntensity
        , logger: this.options.logger
      })
    }

    if(this?.options?.markStart.length && this?.options?.markEnd.length) {
        performance.mark(this.options.markStart)
        performance.mark(this.options.markEnd)

        this.timeToRender = performance.measure(
          'time-to-render',
          this.options.markStart,
          this.options.markEnd
        )
    }

    this.summaryData.push({
        metric: 'Time to render in seconds'
      , value: Number(this.timeToRender.duration.toFixed(2))
    })

    if(this.domain) {
      await this.checkHosting({ 
          domain: this.domain
        , identifier: this.domain
      })

      this.summaryData.push({
          metric: 'Green hosting'
        , value: this.hosting.green
      })
      
      if(this.options?.reportGreenHosting) {
        delete this.hosting.supporting_documents
        this.log({
            title: 'Green reporting'
          , data: this.hosting
          , logger: this.options.logger
        })
      }
    }
    
    if(printTransferSizes) {
      this.log({
          title: 'Transfer size by item'
        , data: this.transferSizeData
        , logger: this.options.logger
      })
    }

    this.log({
        title: 'Summary data'
      , data: this.summaryData
      , logger: this.options.logger
    })
  }

  log({title, data, logger}) {
    console.log('\n')
    console.warn(title)
    console.table(data)

    if(logger) {
      // …
    }
  }
}