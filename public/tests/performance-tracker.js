import { hosting, co2, averageIntensity, marginalIntensity } from "@tgwf/co2"

// See https://sustainablewebdesign.org/estimating-digital-emissions/ for @tgwf/co2

export class PerformanceTracker {
  // Private fields
  #page = null
  #options = {}
  #byteOptions = {}
  #visitOptions = {}
  #transferSizeItems = []
  #summary = []
  #timeToRender = {}    
  #emissionsPerByte = null
  #emissionsPerVisit = null
  #byteTrace = null
  #visitTrace = null
  #hosting = {}
  #perfEntries
  
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

  #log({title, data, logger}) {
    console.log('\n')
    console.warn(title)
    console.table(data)

    if(logger) {
      // …
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
  async logPerformanceEntries({comments}) {
    const perfEntries = JSON.parse(
      await this.#page.evaluate(() => JSON.stringify(performance.getEntries()))
    )

    const parseName = name => {
      const qs = name.indexOf('?')
      return qs > -1 
        ? name.slice(0,qs + 1) // remove querystring parameters
        : name
    }
  
    // Log entries with transfer size (that is greater than zero)
    const exclude = ['element', 'event', 'first-input', 'largest-contentful-paint', 'layout-shift', 'long-animation-frame', 'longtask', 'mark', 'measure', 'paint', 'taskattribution', 'visibility-state']
    const include = ['navigation', 'resource']
    const excluddEntryTypes = perfEntries.filter(e => exclude.includes(e.entryType))

    this.#log({
        title: 'Excluded entry types'
      , data: excluddEntryTypes.map(e => { return { name: parseName(e.name), entryType: e.entryType } })
    })

    this.#log({
        title: 'All'
      , data: perfEntries.map(e => { return { name: parseName(e.name), entryType: e.entryType, initiatorType: e.initiatorType, entryType: e.entryType, transferSize: e.transferSize } })
    })

    perfEntries.forEach(entry => {
      if(entry.transferSize > 0) {
        if(comments) {
          this.#transferSizeItems.push({
              name: parseName(entry.name)
            , entryType: entry.entryType
            , initiatorType: entry.initiatorType
            , transferSizeInBytes: entry.transferSize
            , duration: entry.duration
            , comments
          })
        } else {
          this.#transferSizeItems.push({
              name: parseName(entry.name)
            , entryType: entry.entryType
            , initiatorType: entry.initiatorType
            , transferSizeInBytes: entry.transferSize
          })
        }
      }
    })

    this.#perfEntries = perfEntries

    // Calculate page load time
    const load = Number((perfEntries.findLast(e => e.entryType === 'resource').responseEnd / 1000).toFixed(2))
    this.#summary.push({
        metric: 'Page load time in seconds'
      , value: load
    })
  }

  async logResources({methods = ['GET', 'POST'], srcs = [], logTypes = ['image'], logStatuses = [200]}) {
    if(!this.#options.includeThirdPartyResources) return // exclude third party resources

    this.#page.on('response', async (response) => {

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
        case 'xhr':
        case 'script':
          try {
          const buffer = await response.buffer()
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

  async printSummary({printTransferSizes = false}) {

    // Calculate green hosting
    try {
      if(this.#options.domain) {
        await this.#checkHosting({ 
            domain: this.#options.domain
          , identifier: this.#options.domain
        })

        // Save green hosting
        this.#summary.push({
            metric: 'Green hosting'
          , value: this.#hosting.green
        })
        
        if(this.#options?.reportGreenHosting) {
          delete this.#hosting.supporting_documents
          // Log green hosting
          this.#log({
              title: 'Green reporting'
            , data: this.#hosting
            , logger: this.#options.logger
          })
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
    
    // Log grid intensity
    this.#log({
        title: 'Grid intensity in gCO2e per kWh'
      , data: [{
            coutryCode: this.#options.countryCode
          , gridIntensity: data[this.#options.countryCode]
        }]
      , logger: this.#options.logger
    })

    // Calculate total emissions per byte 
    this.#logPerByte({bytes, bySegment: false})

    const emissionsPerByte = this.#emissionsPerByte * 1000// convert emissions to milligrams

    // Log per emissions per byte
    this.#log({
        title: `Emissions per byte for ${kBs} kilobytes (Kbs)`
      , data: [{
            unit: 'mg/CO2'
          , emissions: Number(emissionsPerByte.toFixed(3))
        }]
      , logger: this.#options.logger
    })

    // Save emissions per byte
    this.#summary.push({
        metric: 'Emissions per byte in mg/CO2'
      , value: Number(emissionsPerByte.toFixed(3))
    })

    // Calculate per emissions per byte per sector
    this.#logPerByte({bytes, bySegment: true})

    const perByteData = Object.keys(this.#emissionsPerByte).map(sector => { 
      return {
          sector
        , emissions: Number((this.#emissionsPerByte[sector] * 1000).toFixed(3)) // convert to milligrams
      }
    }) 

    // Log emissions per byte per sector
    this.#log({
        title: `Emissions per byte per segment for ${kBs} kilobytes (kBs)`
      , data: perByteData
      , logger: this.#options.logger
    })

    // Calculate emissions per visit
    this.#logPerVisit({bytes, bySegment: false})

    const emissionsPerVisit = this.#emissionsPerVisit * 1000 // convert emissions to milligrams

    // Log emissions per visit
    this.#log({
        title: `Emissions per visit in mg/CO2 for ${kBs} kilobytes (kBs)`
      , data: [{
            unit: 'mg/CO2'
          , emissions: Number(emissionsPerVisit.toFixed(3))
        }]
      , logger: this.#options.logger
    })

    // Save emissions per visit
    this.#summary.push({
        metric: 'Emissions per visit in mg/CO2'
      , value: Number(emissionsPerVisit.toFixed(3))
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

    this.#log({
        title: `Emissions per visit per segment for ${kBs} kilobytes (kBs)`
      , data: perVisitData
      , logger: this.#options.logger
    })

    // Calculate emissions per byte trace
    if(this.#byteOptions) {
      this.#byteOptions.gridIntensity = data[this.#options.countryCode]      
      this.#logPerByteTrace({
          bytes
        , green: this.#hosting?.green
        , options: this.#byteOptions
      })

      // Log emissions per byte trace
      this.#log({
          title: 'Byte trace: grid intensity in g/kWh'
        , data: this.#byteTrace.variables.gridIntensity
        , logger: this.#options.logger
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
      this.#log({
          title: 'Visit trace: grid intensity in g/kWh'
        , data: this.#visitTrace.variables.gridIntensity
        , logger: this.#options.logger
      })
    }
    
    // Save include third party resources
    this.#summary.push({
      metric: 'Include third party resources'
    , value: this.#options.includeThirdPartyResources
    })

    // Save total bytes transferred
    this.#summary.push({
      metric: 'Total transfer size in kilobytes (kBs)'
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

    if(this.#options.markDOMLoaded?.length) {
      const timeToLoad = (performance.mark(this.#options.markDOMLoaded)?.startTime || 0) / 1000
        // Save time to load (recorded manually)
        this.#summary.push({
          metric: 'Time to load in seconds (manual)'
        , value: Number(timeToLoad.toFixed(3))
      })
    }

    // Calculate page timings from location
    const locations = [
        `https://www.${this.#options.domain}/`
      , `https://${this.#options.domain}/`
    ]
    const pageTiming = this.#perfEntries.find(e => locations.includes(e.name))
    
    if(pageTiming) {
      const pageDownload = pageTiming.duration / 1000
      const pageDomReady = pageTiming.domContentLoadedEventStart / 1000
      const pageFullyReady = pageTiming.loadEventEnd / 1000
  
      // Save page timings
      this.#summary.push({
          metric: 'Page download time'
        , value: Number(pageDownload.toFixed(3))
      })
  
      this.#summary.push({
          metric: 'Time to DOM ready'
        , value: Number(pageDomReady.toFixed(3))
      })
  
      this.#summary.push({
          metric: 'Time to page fully ready'
        , value: Number(pageFullyReady.toFixed(3))
      })
    }
    
    // Print bytes per request
    if(printTransferSizes) {
      const data = this.#options?.sort?.sortBy
        ? this.#options.sort.sortBy({
              arr: this.#transferSizeItems
            , prop: 'transferSizeInBytes'
            , dir: this.#options.sort.direction
        }) 
        : this.#transferSizeItems

      this.#log({
          title: 'Transfer size by item'
        , data
        , logger: this.#options.logger
      })
    }

    // Log utility
    this.#log({
        title: 'Summary'
      , data: this.#summary
      , logger: this.#options.logger
    })
  }
}