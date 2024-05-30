import puppeteer from 'puppeteer'

import { scroll, isEnabled, pause } from '../utils.js'

const DELAY_FOR_TITLES = 1000
const FIELDNOTES_TITLE = 'Streets of Lisbon, Portugal, Wed Feb 28 2024'
const FIELDNOTES_TITLE_ID = '#fn-autocomplete-title-input-text'
const FIELDNOTES_BTN_ID = '#fetch-fieldnotes-btn'
const PRINT_FIELDNOTES_BTN_ID = '#print-fieldnotes-btn'
const PRINT_FIELDNOTES_WITH_PAGE_BREAKS_BTN_ID = '#print-fieldnotes-with-page-breaks-btn'

import { PerformanceTracker } from '../performance-tracker.js'

const readFieldnotes = async () => {

  let mode = 'dev'

  process.argv.forEach((val, index, array) => {
    const deploy = array.find(item => item.includes('deploy'))
    if(deploy) {
      mode = deploy.split('=')[1]
    }
  })
  
  // Launch the browser
  const browser = await puppeteer.launch({headless: false})
  // Create a page
  const page = await browser.newPage()

  // Set the viewport dimensions
  await page.setViewport({ width: 1280, height: 1024 })

  // Go to read fieldnotes page
  const reponse = mode === 'prod' 
    ? await page.goto('http://ifieldnotes.org')
    : await await page.goto('http://localhost:1234')

  // Create tracker instance
  const perfTracker = new PerformanceTracker(page)
  
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
        await perfTracker.logImageBytes({srcs: ['inaturalist', 'drive.google', 'googleusercontent']})
        // Trigger selection of the entered fieldnotes
        await page.keyboard.press('Enter')
        
        // Fetch fieldnotes if the fetch button is enabled
        if(isEnabled({
          classList: await page.$eval(FIELDNOTES_BTN_ID, el => el.classList)
        })) {
          await page.click(FIELDNOTES_BTN_ID)

          // Track cross domain image weights
          // await perfTracker.logImageBytes({srcs: ['inaturalist', 'drive.google', 'googleusercontent']})
          // Track domain all domains assets
          await pause({func: () => perfTracker.logBytes({comments: 'Fetch fieldnotes'}), delay: 5000})
          
        } else {
          await page.screenshot({path: './public/tests/read-fieldnotes/screenshots/fetch button not ready.png', fullPage: true})
        }              
      }
    })
    
    await pause({
      func: async () => {
        // Without the next 2 lines the function fails. I don't know why.
        const start = performance.mark('fetch-field-notes: start')
        const end = performance.mark('fetch-field-notes: end')

        perfTracker.timeToRender = performance.measure(
          'time-to-render',
          'fetch-field-notes: start',
          'fetch-field-notes: end'
        )
      }, delay: 0
    })
  } catch (error) { 
    await scroll({page})
    await page.screenshot({path: `./public/tests/read-fieldnotes/screenshots/error${Date().now}.png`, fullPage: true})
    console.log(error) 
  } finally {
      setTimeout(async() => {
        await browser.close()
      } , DELAY_FOR_TITLES)

      // perfTracker.logEmissions()
      perfTracker.printSummary({printTranserSizes: true})
      perfTracker.printPerformanceEntries()
  }
}

readFieldnotes()

/**
 * helper classes
 * logger
 * suite of tests (how comprehensive?), how to run?
 * reset the database i.e. when creating entires such as user and field notes
 * blog: what testing and why useful
 */