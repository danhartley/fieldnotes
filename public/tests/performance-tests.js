import puppeteer from 'puppeteer'

import { getDomainFromURL, sortBy, pause } from './test-utils.js'
import { PerformanceTracker } from './performance-tracker.js'

const testSite = async ({byteOptions = null, visitOptions = null}) => {

  let perfTracker, wait = 0, domain, verbose = false

  const verboseArgs = ['-v', '--verbose']
  const domainArgs = ['-d', '--domain']

  process.argv.forEach((val, index) => { 
      if(verboseArgs.includes(val)) verbose = true
      if(domainArgs.includes(val)) {
        const nextArg = index + 1
        if(nextArg < process.argv.length) {
          domain = getDomainFromURL({
            url: process.argv[nextArg]
          })
        }
      }
  })

  if(!domain) {
    console.log('Please check your command line flags:')
    console.log('Correct: -d {domain} {domain name} -v {verbose}')
    console.log('Correct: --domain {domain} {domain name} --verbose {verbose}')
    console.log('Incorrect: -domain {domain} {domain name} --v {verbose}')
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
      await page.goto(`https://${domain}`)
      
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