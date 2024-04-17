import puppeteer from 'puppeteer'

import { scroll, isEnabled, pause } from '../utils.js'

const DELAY_FOR_TITLES = 1000
const FIELDNOTES_TITLE = 'Streets of Lisbon, Portugal, Wed Feb 28 2024'
const FIELDNOTES_TITLE_ID = '#fn-autocomplete-title-input-text'
const FIELDNOTES_BTN_ID = '#fetch-fieldnotes-btn'
const PRINT_FIELDNOTES_BTN_ID = '#print-fieldnotes-btn'
const PRINT_FIELDNOTES_WITH_PAGE_BREAKS_BTN_ID = '#print-fieldnotes-with-page-breaks-btn'

const logBytes = async ({page, comments}) => {
  const perfTable = []

  const perfEntries = JSON.parse(
    await page.evaluate(() => JSON.stringify(performance.getEntries()))
  )
  
  perfEntries.forEach(entry => {
    if(entry.transferSize !== undefined && entry.transferSize > 0) {
      perfTable.push({
          entryType: entry.entryType
        , transferSize: entry.transferSize
        , transferSizeBytes: Math.round(entry.transferSize / 1024)
        , comments
      })
    }
  })

  console.table(perfTable)
}

const observePerformance = () => {
  const perfObserver = (list, observer) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'mark') {
        console.log(`${entry.name}'s startTime: ${entry.startTime}`)
      }
      if (entry.entryType === 'measure') {
        console.log(`${entry.name}'s duration: ${entry.duration}`)
      }
    })  
  }
  const observer = new PerformanceObserver(perfObserver)
  observer.observe({ entryTypes: ['measure', 'mark'] })
}

const parsePerformanceEntities = () => {
  const entries = performance.getEntries()
  entries.forEach((entry) => {
    if (entry.entryType === "mark") {
      console.log(`${entry.name}'s startTime: ${entry.startTime}`)
    }
    if (entry.entryType === "measure") {
      console.log(`${entry.name}'s duration: ${entry.duration}`)
    }
  })
}

const readFieldnotes = async () => {
  let browser, page = null
  
  try {
    // Launch the browser
    browser = await puppeteer.launch({headless: false})
    // Create a page
    page = await browser.newPage()

    // Set the viewport dimensions
    await page.setViewport({ width: 1280, height: 1024 })

    // Go to read fieldnotes page
    await page.goto('http://localhost:1234')

    await pause({func: () => logBytes({
        page
      , comments: 'Load page'
    })})
    
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
          await page.click(FIELDNOTES_BTN_ID)
        } else {
          await page.screenshot({path: './public/tests/read-fieldnotes/screenshots/fetch button not ready.png', fullPage: true})
        }              
        await pause({func: () => logBytes({
            page
          , comments: 'Fetch fieldnotes'
        }), delay: 500})
      }
    })
    
    await pause({
      func: async () => {
        // Without the next 2 lines the function fails. I don't know why.
        const start = performance.mark('fetch-field-notes: start')
        const end = performance.mark('fetch-field-notes: end')

        const timeToRender = performance.measure(
          'time-to-render',
          'fetch-field-notes: start',
          'fetch-field-notes: end'
        )
        await pause({
          func: () => {
            console.log({
                name: timeToRender.name
              , duration: timeToRender.duration.toFixed(2)
            })
          }, delay: 0
        })
      }, delay: 0
    })

    observePerformance()

    parsePerformanceEntities()

  } catch (error) { 
    await scroll({page})
    await page.screenshot({path: `./public/tests/read-fieldnotes/screenshots/error${Date().now}.png`, fullPage: true})
    console.log(error) 

  } finally {
      setTimeout(async() => {
        // await browser.close()
      } , DELAY_FOR_TITLES + 2000)
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