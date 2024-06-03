import puppeteer from 'puppeteer'

import { pause, sortBy } from './test-utils.js'
import { PerformanceTracker } from './performance-tracker.js'

const testSite = async ({byteOptions = null, visitOptions = null}) => {

  let srcs

  // Check node argument in the command line for domain
  const domain = process.argv.find(arg => arg.includes('domain'))?.split('=')[1]

  if(!domain) return

  // Check node argument in the command line for third party resources
  const resources = process.argv.find(arg => arg.includes('resources'))?.split('=')[1]
  srcs = resources?.split(',')

  // Launch the browser
  const browser = await puppeteer.launch({headless: false})

  // Create a page
  const page = await browser.newPage()

  // Set the viewport dimensions
  await page.setViewport({ width: 1280, height: 1024 })

  // Navigate to site
  await page.goto(`https://${domain}`)

  // Create instance of performance tracker 
  const perfTracker = new PerformanceTracker({
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
      }
      , byteOptions
      , visitOptions
  })

  try {
    await perfTracker.logResources({srcs, logTypes:['image', 'xhr', 'script', 'stylesheet', 'fetch']})
    await pause({func: () => perfTracker.logPerformanceEntries({comments: null}), delay: 5000})
  } catch(e) {
    console.log(e)
  } finally {
    // await browser.close()
    perfTracker.printSummary({printTransferSizes: true})
  }
}

testSite({})