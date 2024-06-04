import puppeteer from 'puppeteer'

import { pause, sortBy } from './test-utils.js'
import { PerformanceTracker } from './performance-tracker.js'

const testSite = async ({byteOptions = null, visitOptions = null}) => {

  let perfTracker, srcs, delay = 2000

  // Check node argument in the command line for domain
  const domain = process.argv.find(arg => arg.includes('domain'))?.split('=')[1]

  if(!domain) return

  // Check node argument in the command line for third party resources
  const resources = process.argv.find(arg => arg.includes('resources'))?.split('=')[1]
  srcs = resources?.split(',')

  // Launch the browser
  const browser = await puppeteer.launch({
      headless: false,
  })

  // Create a page
  const page = await browser.newPage()

  // Set the viewport dimensions
  await page.setViewport({ width: 1280, height: 1024 })
  
  try {
      // Create instance of performance tracker 
      perfTracker = new PerformanceTracker({
        page
      , options: {
              domain
            , reportGreenHosting: true
            , countryCode: 'PRT'
            , includeThirdPartyResources: true
            , sort: {
                sortBy
              , direction: 'desc'
            }
            // , markDOMLoaded: 'DOM loaded'
            , verbose: true
          }
          , byteOptions
          , visitOptions
      })
      
      // Navigate to site
      await page.goto(`https://${domain}`)
      
      page.evaluateOnNewDocument(perfTracker.logResources({srcs, logTypes:['image', 'xhr', 'script', 'stylesheet', 'fetch']}))
      await pause({func: () => perfTracker.logPerformanceEntries(), delay: 5000})
  } catch(e) {
    console.log(e)
  } finally {
    // await browser.close()
    if(perfTracker) {
      await perfTracker.printSummary()
      const { summary, details } = perfTracker.getReport()
      // console.log('summary', summary)
      // console.log('details', details)
    }
  }
}

testSite({})