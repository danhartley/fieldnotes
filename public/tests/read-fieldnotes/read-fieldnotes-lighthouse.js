import puppeteer from 'puppeteer'
import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'

import { reports } from '@danhartley/emissions'
import { scroll, isEnabled, pause } from '../test-utils.js'

const DELAY_FOR_TITLES = 1000
const FIELDNOTES_TITLE = 'Streets of Lisbon, Portugal, Wed Feb 28 2024'
const FIELDNOTES_TITLE_2 = 'Benenden, UK, Saturday Feb 03 2024'
const FIELDNOTES_TITLE_3 = 'Barreiro, Portugal, Thu Apr 18 2024'
const FIELDNOTES_TITLE_ID = '#fn-autocomplete-title-input-text'
const FIELDNOTES_BTN_ID = '#fetch-fieldnotes-btn'
const PRINT_FIELDNOTES_BTN_ID = '#print-fieldnotes-btn'
const PRINT_FIELDNOTES_WITH_PAGE_BREAKS_BTN_ID =
  '#print-fieldnotes-with-page-breaks-btn'

const readFieldnotes = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    defaultViewport: null,
  })

  const page = await browser.newPage()

  // Establish domain from deploy flag (dev or prod depending on the node argument in the command line)
  const deploy =
    process.argv.find((arg) => arg.includes('deploy'))?.split('=')[1] || 'dev'
  const url =
    deploy === 'prod' ? 'https://www.ifieldnotes.org' : 'http://localhost:3000'

  // await parseEmissions(page, url)

  try {
    // Navigate to site
    await page.goto(url)

    const { report } = await reports.lighthouse(url, lighthouse, chromeLauncher)
    console.log(report)

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

    // here

    await pause({
      func: async () => {
        await page.locator(FIELDNOTES_TITLE_ID).fill(FIELDNOTES_TITLE_2)
        await page.click(FIELDNOTES_BTN_ID)
      },
      delay: 5000,
    })

    // here

    await pause({
      func: async () => {
        await page.locator(FIELDNOTES_TITLE_ID).fill(FIELDNOTES_TITLE_3)
        await page.click(FIELDNOTES_BTN_ID)
      },
      delay: 5000,
    })

    // here
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
