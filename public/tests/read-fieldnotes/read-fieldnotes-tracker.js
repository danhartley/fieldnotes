import puppeteer from 'puppeteer'

import { EmissionsTracker } from '@danhartley/emissions'
import { scroll, isEnabled, pause, sortBy, logEmissions } from '../test-utils.js'
import { config } from '../test-config.js'

const DELAY_FOR_TITLES = 1000
const FIELDNOTES_TITLE = 'Streets of Lisbon, Portugal, Wed Feb 28 2024'
const FIELDNOTES_TITLE_2 = 'Benenden, UK, Saturday Feb 03 2024'
const FIELDNOTES_TITLE_3 = 'Barreiro, Portugal, Thu Apr 18 2024'
const FIELDNOTES_TITLE_ID = '#fn-autocomplete-title-input-text'
const FIELDNOTES_BTN_ID = '#fetch-fieldnotes-btn'

const readFieldnotes = async () => {
  let tracker

  const browser = await puppeteer.launch({
    headless: false,
    // devtools: true,
    defaultViewport: null,
  })

  const page = await browser.newPage()

  await page.setViewport({
    width: config.viewport.desktop.width, 
    height: config.viewport.desktop.height
  })
  
  // Establish domain from deploy flag (dev or prod depending on the node argument in the command line)
  const deploy =
    process.argv.find((arg) => arg.includes('deploy'))?.split('=')[1] || 'dev'
  const url =
    deploy === 'prod' ? 'https://www.ifieldnotes.org' : 'http://localhost:3007/read-fieldnotes'

  const options = {
    url,
    domain: 'localhost:3003',
    reportGreenHosting: true,
    countryCode: 'PRT',
    sort: {
      sortBy,
      direction: 'desc',
    },
  }

  try {
    tracker = new EmissionsTracker(
      page,
      options
    )

    // Navigate to site
    await page.goto(url)

    await pause({
      func: async () => {
        await tracker.getReport()
      },
      delay: 5000,
    })

    // Abort test if the fetch button is already enabled
    if (
      isEnabled({
        classList: await page.$eval(FIELDNOTES_BTN_ID, (el) => el.classList),
      })
    ) {
      console.error('The initial state is wrong, aborting test')
    }

    // Populate fieldnotes to display
    await page.locator(FIELDNOTES_TITLE_ID).fill(FIELDNOTES_TITLE)

    await pause({
      func: async () => {
        // Trigger selection of the entered fieldnotes
        await page.keyboard.press('Enter')
        // Fetch fieldnotes if the fetch button is enabled
        if (
          isEnabled({
            classList: await page.$eval(
              FIELDNOTES_BTN_ID,
              (el) => el.classList
            ),
          })
        ) {
          // Fetch fieldnotes
          await page.click(FIELDNOTES_BTN_ID)
        } else {
          await page.screenshot({
            path: './public/tests/read-fieldnotes/screenshots/fetch button not ready.png',
            fullPage: true,
          })
        }
      },
      delay: 500,
    })

    await pause({
      func: async () => {
        await tracker.getReport()
      },
      delay: 5000,
    })

    await pause({
      func: async () => {
        await page.locator(FIELDNOTES_TITLE_ID).fill(FIELDNOTES_TITLE_2)
        await page.click(FIELDNOTES_BTN_ID)
      },
      delay: 5000,
    })

    await pause({
      func: async () => {
        await tracker.getReport()
      },
      delay: 5000,
    })

    await pause({
      func: async () => {
        await page.locator(FIELDNOTES_TITLE_ID).fill(FIELDNOTES_TITLE_3)
        await page.click(FIELDNOTES_BTN_ID)
      },
      delay: 5000,
    })

    await pause({
      func: async () => {
        const { std } = await tracker.getReport()
        const {
          pageWeight,
          count,
          emissions,
          greenHosting,
          data,
          domain,
        } = std

        logEmissions({
          url,
          pageWeight,
          count,
          emissions,
          greenHosting,
          data,
          domain,
        })
      },
      delay: 5000,
    })
  } catch (e) {
    await scroll({ page })
    await page.screenshot({
      path: `./public/tests/read-fieldnotes/screenshots/error${Date().now}.png`,
      fullPage: true,
    })
    console.log(e)
  } finally {
    setTimeout(async () => {
      await browser.close()
    }, DELAY_FOR_TITLES)
  }
}

readFieldnotes()
