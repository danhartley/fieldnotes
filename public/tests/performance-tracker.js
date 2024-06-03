import { hosting, co2, averageIntensity, marginalIntensity } from "@tgwf/co2"

// See https://sustainablewebdesign.org/estimating-digital-emissions/ for @tgwf/co2

export class PerformanceTracker {
  // Private fields
  #page = null
  #options = {}
  #byteOptions = {}
  #visitOptions = {}
  #transferSizeData = []
  #summary = []
  #timeToRender = {}    
  #startTime = 0
  #endTime = 0
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
    if(domain.length) {      
      const options = {
        verbose
      , userAgentIdentifier: identifier,
    }

    this.#hosting = await hosting.check(domain, options)
    } else {
      this.#hosting = { hosted_by: 'unknown', green: false }
    }
  }

  // Public methods
  async logPerformanceEntries({comments}) {
    const perfEntries = JSON.parse(
      await this.#page.evaluate(() => JSON.stringify(performance.getEntries()))
    )
  
    // Log entries with transfer size (that is greater than zero)
    perfEntries.forEach(entry => {
      if(entry.transferSize > 0) {
        this.#transferSizeData.push({
            entryType: entry.entryType
          , transferSizeInBytes: entry.transferSize
          , comments
        })
      }
    })
  }

  async logResources({methods = ['GET', 'POST'], srcs = [], logTypes = ['image'], logStatuses = [200]}) {
    if(!this.#options.includeThirdPartyResources) return // exclude third party resources

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
          this.#transferSizeData.push({
              entryType: resourceType
            , transferSizeInBytes: buffer.length
            , comments: url
        })
        break
      }   
    })
  }

  async printSummary({printTransferSizes = false}) {

      // Calculate green hosting
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

    // Calculate total bytes transferred
    const bytes = this.#transferSizeData.reduce((accumulator, currentValue) => accumulator + currentValue.transferSizeInBytes, 0)
    const kBs = bytes / 1000 // convert bytes to kbs
    
    // Get country specific grid intensities
    const { data, type, year } = averageIntensity
    const { data: miData, type: miType, year: miYear } = marginalIntensity
    
    // Calculate grid intensity for location
    this.#byteOptions.gridIntensity = this.#visitOptions.gridIntensity = data[this.#options.countryCode]
    
    // Log grid intensity
    this.#log({
        title: 'Grid intensity in gCO2e per kWh'
      , data: [{
            coutryCode: this.#options.countryCode
          , gridIntensity: this.#byteOptions.gridIntensity
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
      metric: 'Total transfer size in bytes'
    , value: bytes
    })

    // Calculate time to render
    if(this.#options.markStart.length && this.#options.markEnd.length) {
        this.#startTime = performance.mark(this.#options.markStart)?.startTime || 0
        this.#endTime = performance.mark(this.#options.markEnd)?.startTime || 0

        this.#timeToRender = performance.measure(
          'time-to-render',
          this.#options.markStart,
          this.#options.markEnd
        )
    }

    // Save start render
    this.#summary.push({
        metric: 'Start render'
      , value: this.#startTime
    })

    // Save end render
    this.#summary.push({
        metric: 'End render'
      , value: this.#endTime
    })

    // Save time to render
    this.#summary.push({
        metric: 'Time to render in seconds'
      , value: Number(this.#timeToRender.duration.toFixed(3))
    })
    
    // Print bytes per request
    if(printTransferSizes) {
      this.#log({
          title: 'Transfer size by item'
        , data: this.#transferSizeData
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