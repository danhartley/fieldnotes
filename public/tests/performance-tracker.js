import { hosting, co2, averageIntensity, marginalIntensity } from "@tgwf/co2"
import { getDomainFromURL } from './test-utils.js'

// See https://sustainablewebdesign.org/estimating-digital-emissions/ for @tgwf/co2
// See https://github.com/addyosmani/puppeteer-webperf

export class PerformanceTracker {
  // Private fields
  #page = null
  #options = {}
  #byteOptions = {}
  #visitOptions = {}
  #transferSizeItems = []
  #timeToRender = {}    
  #emissionsPerByte = null
  #emissionsPerVisit = null
  #byteTrace = null
  #visitTrace = null
  #hosting = {}
  #perfEntries
  #summary = []
  #details = []

  // Static fields
  static #entryTypes = [
    "element",
    "event",
    "first-input",
    "largest-contentful-paint",
    "layout-shift",
    "long-animation-frame",
    "longtask",
    "mark",
    "measure",
    "navigation",
    "paint",
    "resource",
    "visibility-state" 
  ]

  static #entryTypesProfiled = ['navigation', 'resource']

  // Static methods
  static entryTypes() {
    return PerformanceTracker.#entryTypes
  }

  static entryTypesProfiled() {
    return PerformanceTracker.#entryTypesProfiled
  }

  static parseName(name) {
    const qs = name.indexOf('?')
    return qs > -1 
      ? name.slice(0,qs) // remove querystring parameters
      : name
  }

  static parseDomain(name) {
    const pretty = name.indexOf('/')
    return pretty > -1 
      ? name.slice(0,pretty) // remove pretty parameters
      : name
  }

  static logOut({title, data}) {
    console.log('\n')
    console.warn(title)
    console.table(data)
  }
  
  constructor({page, options, byteOptions, visitOptions}) {
    this.#page = page
    this.#options = options
    this.#byteOptions = byteOptions
    this.#visitOptions = visitOptions    
  }

  // Private methods
  #logPerByte({bytes, bySegment = false}) {
    const co2Emission = bySegment ? new co2({ results: "segment" }) : new co2()
    this.#emissionsPerByte = co2Emission.perByte(bytes, true)
  }

  #logPerVisit({bytes, bySegment = false}) {
    const co2Emission = bySegment ? new co2({ results: "segment" }) : new co2()
    this.#emissionsPerVisit = co2Emission.perVisit(bytes, true)
  }

  #logPerByteTrace({bytes, green = false, options}) {
    if(bytes) {
      const co2Emission = new co2()
      this.#byteTrace = co2Emission.perByteTrace(bytes, green, options)
    }
  }

  #logPerVisitTrace({bytes, green = false, options}) {
    if(bytes) {
      const co2Emission = new co2()
      this.#visitTrace = co2Emission.perVisitTrace(bytes, green, options)
    }
  }  

  async #checkHosting({domain = '', verbose = true, identifier = ''}) {
    try {
      if(domain.length) {      
        const options = {
          verbose
        , userAgentIdentifier: identifier,
      }

      this.#hosting = await hosting.check(domain, options)
      } else {
        this.#hosting = { hosted_by: 'unknown', green: false }
      }
    } catch (e) {
      this.#hosting = { hosted_by: 'unknown', green: false }
      console.log(e)
    }
  }

  // Public methods
  async logPerformanceEntries() {
    this.#perfEntries = JSON.parse(
      await this.#page.evaluate(() => JSON.stringify(performance.getEntries()))
    )
  
    // Log entries with transfer size (that is greater than zero)    
    const entryTypesNotProfiled = PerformanceTracker.entryTypes().filter(e => !PerformanceTracker.entryTypesProfiled().includes(e))
    const entryNotProfiled = this.#perfEntries.filter(e => entryTypesNotProfiled.includes(e.entryType))

    if(this.#options.verbose) {
      PerformanceTracker.logOut({
          title: 'Excluded performance entry types'
        , data: entryNotProfiled.map(e => { return { name: PerformanceTracker.parseName(e.name), entryType: e.entryType } })
      })
    }

    if(this.#options.verbose) {
      PerformanceTracker.logOut({
          title: 'Performance entries'
        , data: this.#perfEntries.map(e => { return { name: PerformanceTracker.parseName(e.name), entryType: e.entryType, initiatorType: e.initiatorType, entryType: e.entryType, transferSize: e.transferSize } })
      })
    }

    this.#perfEntries.forEach(entry => {
      if(entry.transferSize > 0) {
          this.#transferSizeItems.push({
              name: PerformanceTracker.parseName(entry.name)
            , entryType: entry.entryType
            , initiatorType: entry.initiatorType
            , transferSizeInBytes: entry.transferSize
          })
      }
    })

    // Save number of requests
    this.#summary.push({
        metric: 'Number of requests: of type navigation or resource'
      , value: this.#perfEntries.filter(e => PerformanceTracker.entryTypesProfiled().includes(e.entryType)).length
    })
  }

  async logPerformanceEntriesObserved() {
   return () => {
      new PerformanceObserver(async(list) => {
        list.getEntries().forEach((item) => {
          console.log(item)
        })
        this.#perfEntries = JSON.parse(
          await this.#page.evaluate(() => JSON.stringify(list.getEntries()))
        )
      }).observe({type: 'resource', buffered: true})
    }
  }

  async logResources() {
    if(this.#options.includeThirdPartyResources) {
      const methods = ['GET', 'POST']
      const logTypes = ['image', 'xhr', 'script']
      const logStatuses = [200]
      
      this.#page.on('response', async (response) => {
        
        const url = response.request().url()
        const resourceType = response.request().resourceType()

        // Check resource is one we want to measure
        const isValidMethod = methods.includes(response.request().method())
        const isValidSrc = getDomainFromURL({url}) !== this.#options.domain
        const isValidStatus = logStatuses.length ? logStatuses.includes(response.status()) : true
        const isValidType = logTypes.length ? logTypes.includes(resourceType) : true
        const isValidResource = isValidMethod && isValidSrc && isValidType && isValidStatus

        if(!isValidResource) return

        switch(resourceType) {
          case 'image':
          case 'xhr':
          case 'script':
            try {
              const buffer = await response.buffer()
              console.log({
                  name: url
                , entryType: resourceType
                , transferSizeInBytes: buffer.length
              })
              this.#transferSizeItems.push({
                  name: url
                , entryType: resourceType
                , transferSizeInBytes: buffer.length
              })
            } catch (e) {
              console.log(e)
              console.log('resourceType: ', resourceType)
            }
          break
        }   
      })
    }
  }

  async printSummary() {

    // Calculate green hosting
    try {
      if(this.#options.domain) {
        await this.#checkHosting({ 
            domain: PerformanceTracker.parseDomain(this.#options.domain)
          , identifier: this.#options.domain
        })

        // Save green hosting
        this.#summary.push({
            metric: 'Green hosting'
          , value: this.#hosting.green
        })
        
        if(this.#options?.reportGreenHosting) {
          delete this.#hosting.supporting_documents
          
          const data = {
              title: 'Green reporting'
            , data: this.#hosting
          }

          if(this.#options.verbose) {
            // Log green hosting
            PerformanceTracker.logOut(data)
          }

          // Save green hosting details
          this.#details.push(data)
        }
      }
    } catch(e) {
      console.log(e)
    }

    // Calculate total bytes transferred
    const bytes = this.#transferSizeItems.reduce((accumulator, currentValue) => accumulator + currentValue.transferSizeInBytes, 0)
    const kBs = Number((bytes / 1000).toFixed(1)) // convert bytes to kbs
    
    // Get country specific grid intensities
    const { data, type, year } = averageIntensity
    const { data: miData, type: miType, year: miYear } = marginalIntensity

    const gridData = {
        title: 'Grid intensity in gCO2e per kWh'
      , data: [{
          coutryCode: this.#options.countryCode
        , gridIntensity: data[this.#options.countryCode]
      }]
    }    

    if(this.#options.verbose) {
      // Log grid intensity
      PerformanceTracker.logOut(gridData)
    }

    // Save grid intensity for country code
    this.#details.push(gridData)

    // Save grid intensity
    this.#summary.push({
        metric: 'Grid intensity in gCO2e per kWh'
      , value: gridData.data[0].gridIntensity
    })

    // Calculate total emissions per byte 
    this.#logPerByte({bytes, bySegment: false})

    if(this.#options.verbose) {
      // Log per emissions per byte
      PerformanceTracker.logOut({
          title: `Emissions per byte for ${kBs} kilobytes (Kbs)`
        , data: [{
              unit: 'mg/CO2'
            , emissions: Number((this.#emissionsPerByte * 1000).toFixed(3))
          }]
      })
    }

    // Save emissions per byte
    this.#summary.push({
        metric: 'Emissions per byte in mg/CO2'
      , value: Number((this.#emissionsPerByte * 1000).toFixed(3))
    })

    this.#summary.push({
        metric: 'Emissions per byte in g/CO2'
      , value: Number(this.#emissionsPerByte.toFixed(3))
    })

    // Calculate per emissions per byte per sector
    this.#logPerByte({bytes, bySegment: true})

    const perByteData = Object.keys(this.#emissionsPerByte).map(sector => { 
      return {
          sector
        , emissions: Number((this.#emissionsPerByte[sector] * 1000).toFixed(3)) // convert to milligrams
      }
    }) 

    const byteData = {
        title: `Emissions per byte per segment for ${kBs} kilobytes (kBs)`
      , data: perByteData
    }

    if(this.#options.verbose) {
      // Log emissions per byte per sector
      PerformanceTracker.logOut(byteData)
    }

    // Save emissions per byte per sector
    this.#details.push(byteData)

    // Calculate emissions per visit
    this.#logPerVisit({bytes, bySegment: false})

    if(this.#options.verbose) {
      // Log emissions per visit
      PerformanceTracker.logOut({
          title: `Emissions per visit in mg/CO2 for ${kBs} kilobytes (kBs)`
        , data: [{
              unit: 'mg/CO2'
            , emissions: Number((this.#emissionsPerVisit * 1000).toFixed(3))
          }]
      })
    }
    
    // Save emissions per visit
    this.#summary.push({
        metric: 'Emissions per visit in mg/CO2'
      , value: Number((this.#emissionsPerVisit * 1000).toFixed(3))
    })

    this.#summary.push({
        metric: 'Emissions per visit in g/CO2'
      , value: Number((this.#emissionsPerVisit).toFixed(3))
    })

    // Calculate emissions per visit per sector
    this.#logPerVisit({bytes, bySegment: true})

    // Log emissions per visit per sector
    const perVisitData = Object.keys(this.#emissionsPerVisit).map(sector => { 
      return {
          sector
        , emissions: Number((this.#emissionsPerVisit[sector] * 1000).toFixed(3)) // convert to milligrams
      }
    }) 

    const visitData = {
        title: `Emissions per visit per segment for ${kBs} kilobytes (kBs)`
      , data: perVisitData
    }

    if(this.#options.verbose) {
      //Log emissions per visit per sector
      PerformanceTracker.logOut(visitData)
    }

    // Save emissions per visit per sector
    this.#details.push(visitData)

    // Calculate emissions per byte trace
    if(this.#byteOptions) {
      this.#byteOptions.gridIntensity = data[this.#options.countryCode]      
      this.#logPerByteTrace({
          bytes
        , green: this.#hosting?.green
        , options: this.#byteOptions
      })

      // Log emissions per byte trace
      PerformanceTracker.logOut({
          title: 'Byte trace: grid intensity in g/kWh'
        , data: this.#byteTrace.variables.gridIntensity
      })
    }

    // Calculate emissions per visit trace
    if(this.#visitOptions) {
      this.#visitOptions.gridIntensity = data[this.#options.countryCode]
      this.#logPerVisitTrace({
          bytes
        , green: this.#hosting?.green
        , options: this.#visitOptions
      })

      // Log emissions per visit trace
      PerformanceTracker.logOut({
          title: 'Visit trace: grid intensity in g/kWh'
        , data: this.#visitTrace.variables.gridIntensity
      })
    }

    // Save total bytes transferred
    this.#summary.push({
      metric: 'Kbs transferred'
    , value: kBs
    })

    // Calculate time to fetch data
    if(this.#options.markStart?.length && this.#options.markEnd?.length) {
        performance.mark(this.#options.markStart)?.startTime || 0
        performance.mark(this.#options.markEnd)?.startTime || 0

        this.#timeToRender = performance.measure(
          'time-to-render',
          this.#options.markStart,
          this.#options.markEnd
        )

        // Save time to fetch
        this.#summary.push({
            metric: 'Time to fetch data in seconds'
          , value: Number(this.#timeToRender.duration.toFixed(3))
        })
    }

    // Calculate page timings from page
    const pageTiming = this.#perfEntries.find(e => e.entryType === 'navigation')
    
    if(pageTiming) {
      const pageTimingName = pageTiming.name
      const pageDOMContentLoadedEventEnd = pageTiming.domContentLoadedEventEnd 
      const pageTimingDuration = pageTiming.duration
  
      // Save page timings
      this.#summary.push({
          metric: 'Website name'
        , value: pageTimingName
      })

      this.#summary.push({
          metric: 'DOMContentLoaded in ms'
        , value: Math.round(pageDOMContentLoadedEventEnd)
      })

      this.#summary.push({
          metric: 'Load: duration in ms'
        , value: Math.round(pageTimingDuration)
      })
    } else {
      console.log('\n')
      console.log('** Please check the domain name you supplied as an argument. **')
    }
    
    if(this.#options.verbose) {
      // Print bytes per request
      const data = this.#options?.sort?.sortBy
        ? this.#options.sort.sortBy({
              arr: this.#transferSizeItems
            , prop: 'transferSizeInBytes'
            , dir: this.#options.sort.direction
        }) 
        : this.#transferSizeItems

      PerformanceTracker.logOut({
          title: 'Transfer size by item'
        , data
      })
    }    

    // Log utility
    PerformanceTracker.logOut({
        title: 'Summary'
      , data: this.#summary
    })
  }

  async getReport() {
    await this.#page.evaluateOnNewDocument(this.logResources())
    await this.logPerformanceEntries()
    await this.printSummary()
    return {
        summary: this.#summary
      , details: this.#details
    }
  }
}