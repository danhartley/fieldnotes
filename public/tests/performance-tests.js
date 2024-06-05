import puppeteer from 'puppeteer'

import { getDomainFromURL, sortBy, pause } from './test-utils.js'
import { PerformanceTracker } from './performance-tracker.js'

const testSite = async ({byteOptions = null, visitOptions = null}) => {

  let perfTracker, url, domain, verbose = false

  const verboseArgs = ['-v', '--verbose']
  const urlArgs = ['-u', '--url']

  process.argv.forEach((val, index) => { 
      if(verboseArgs.includes(val)) verbose = true
      if(urlArgs.includes(val)) {
        const nextArg = index + 1
        if(nextArg < process.argv.length) {
          url = process.argv[nextArg]
          domain = getDomainFromURL({url})
        }
      }
  })

  if(!domain) {
    console.log('Please check your command line flags:')
    console.log('Correct: -u {url value} -v {verbose}')
    console.log('Correct: --url {url value} --verbose {verbose}')
    console.log('Incorrect: -url {url value} --v {verbose}')
    return
  }

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
            , verbose
          }
          , byteOptions
          , visitOptions
      })

      // Navigate to site
      await page.goto(url)
      
      // Get performance report
      await pause({
        func: async () => {
          await perfTracker.getReport()
        }
      }, 0)
  } catch(e) {
    console.log(e)
  } finally {
    await browser.close()
  }
}

testSite({})