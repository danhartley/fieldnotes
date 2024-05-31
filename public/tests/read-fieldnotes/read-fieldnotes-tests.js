import puppeteer from 'puppeteer'

import { scroll, isEnabled, pause } from '../test-utils.js'

const DELAY_FOR_TITLES = 1000
const FIELDNOTES_TITLE = 'Streets of Lisbon, Portugal, Wed Feb 28 2024'
const FIELDNOTES_TITLE_ID = '#fn-autocomplete-title-input-text'
const FIELDNOTES_BTN_ID = '#fetch-fieldnotes-btn'
const PRINT_FIELDNOTES_BTN_ID = '#print-fieldnotes-btn'
const PRINT_FIELDNOTES_WITH_PAGE_BREAKS_BTN_ID = '#print-fieldnotes-with-page-breaks-btn'

import { PerformanceTracker } from '../performance-tracker.js'

const readFieldnotes = async () => {

  // Launch the browser
  const browser = await puppeteer.launch({headless: false})
  
  // Create a page
  const page = await browser.newPage()

  // Set the viewport dimensions
  await page.setViewport({ width: 1280, height: 1024 })

  // Establish domain from deploy flag (dev or prod depending on the node argument in the command line)
  const deploy = process.argv.find(arg => arg.includes('deploy'))?.split('=')[1] || 'dev'
  const domain = deploy === 'prod'
    ? 'ifieldnotes.org'
    : 'localhost:1234'

  // Go to read fieldnotes page
  await page.goto(`http://${domain}`)

  // Create instance of performance tracker 
  const perfTracker = new PerformanceTracker({
      page
    , options: {
          domain
        , markStart: 'fetch-field-notes: start'
        , markEnd: 'fetch-field-notes: end'
        , reportGreenHosting: true
      }
  })
  
  try {
    // Abort test if the fetch button is already enabled
    if(isEnabled({
      classList: await page.$eval(FIELDNOTES_BTN_ID, el => el.classList)
    })) {
      console.error('The initial state is wrong, aborting test')
    }

    // Populate fieldnotes to display
    await page.locator(FIELDNOTES_TITLE_ID).fill(FIELDNOTES_TITLE) 

    await pause({
      func: async () => {
        // Trigger selection of the entered fieldnotes
        await page.keyboard.press('Enter')        
        // Fetch fieldnotes if the fetch button is enabled
        if(isEnabled({
          classList: await page.$eval(FIELDNOTES_BTN_ID, el => el.classList)
        })) {
          // Fetch fieldnotes
          await page.click(FIELDNOTES_BTN_ID)
          // Log cross domain images
          await perfTracker.logResources({srcs: ['inaturalist', 'drive.google', 'googleusercontent']})
          // Log domains entities. Wait 5 seconds for images to download before calling.
          await pause({func: () => perfTracker.logEntries({comments: 'Fetch fieldnotes'}), delay: 5000})          
        } else {
          await page.screenshot({path: './public/tests/read-fieldnotes/screenshots/fetch button not ready.png', fullPage: true})
        }              
      }
    })    
  } catch (error) { 
    await scroll({page})
    await page.screenshot({path: `./public/tests/read-fieldnotes/screenshots/error${Date().now}.png`, fullPage: true})
    console.log(error) 
  } finally {
      setTimeout(async() => {
        await browser.close()
      } , DELAY_FOR_TITLES)
      
      perfTracker.printSummary({
          printTransferSizes: true
      })
  }
}

readFieldnotes()

// Custom settings
let options

// Use perByteTrace
options = {

}
// readFieldnotes(options)

// Use perVisitTrace
options = {

}
// readFieldnotes(options)