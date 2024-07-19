import puppeteer from 'puppeteer'

import { scroll, pause } from '../utils.js'

const DELAY = 2000
const FIREBASE_EMAIL_INPUT_TXT = '#firebase-email'
const FIREBASE_PASSWORD_INPUT_TXT = '#firebase-password'
const FIREBASE_EMAIL = 'readandwrite@learn-the-planet.com'
const FIREBASE_PASSWORD = 'readandwrite'
const AUTHENTICATE_BTN = '#authenticate-btn'
const FIELDNOTES_TITLE_INPUT_TXT = '#fn-autocomplete-title-input-text'
const FIELDNOTES_TITLE = 'Practice notes 1'
const FETCH_FIELDNOTES_BTN = '#fetch-fieldnotes-btn'

const login = async (page) => {
  // Go to read fieldnotes page
  await page.goto('http://localhost:1234/write-fieldnotes.html')

  // Logins the user
  await page.locator(FIREBASE_EMAIL_INPUT_TXT).fill(FIREBASE_EMAIL)
  await page.locator(FIREBASE_PASSWORD_INPUT_TXT).fill(FIREBASE_PASSWORD)
  await page.click(AUTHENTICATE_BTN)
}

export const editFieldnotes = async () => {
  let browser,
    page = null

  try {
    // Launch the browser
    browser = await puppeteer.launch({ headless: false })
    // Create a page
    page = await browser.newPage()

    // Set the viewport dimensions
    await page.setViewport({ width: 1640, height: 1024 })

    login(page)
    // Abort test if the fetch button is already enabled
    // if(isEnabled({
    //   classList: await page.$eval(AUTHENTICATE_BTN, el => el.classList)
    // })) {
    //   console.error('The initial state is wrong, aborting test')
    // }

    // Create a new set of fieldnotes
    await page.locator(FIELDNOTES_TITLE_INPUT_TXT).fill(FIELDNOTES_TITLE)

    setTimeout(async () => {
      await page.keyboard.press('Enter')
      await page.click(FETCH_FIELDNOTES_BTN)
    }, DELAY)
  } catch (error) {
    await scroll({ page })
    await page.screenshot({
      path: `./public/tests/write-fieldnotes/screenshots/error${Date().now}.png`,
      fullPage: true,
    })
    console.log(error)
  } finally {
    await browser.close()
  }
}

// editFieldnotes()

const SHOW_HIDE_CREATE_FIELDNOTES_BTN = '#show-hide-create-fieldnotes-btn'
const INAT_AUTOCOMPLETE_INPUT_TEXT = '#inat-autocomplete-input-text'
const INAT_USERNAME = 'danielhartley'
const SINGLE_OBSERVATIONS_INPUT_DATE = '#single-observations-input-date'
const INAT_DATE = '2024-04-11'
const SEARCH_INAT_OBSERVATIONS_BTN = '#search-inat-observations-btn'

const writeFieldnotes = async () => {
  let browser,
    page = null

  try {
    // Launch the browser
    browser = await puppeteer.launch({ headless: false, devtools: true })
    // Create a page
    page = await browser.newPage()

    // Set the viewport dimensions
    await page.setViewport({ width: 1640, height: 1024 })

    // Authenticate
    login(page)

    // Open write new field notes
    await pause({
      func: async () => {
        await page.click(SHOW_HIDE_CREATE_FIELDNOTES_BTN)
        // Enter iNaturalist user to search for
        await page.locator(INAT_AUTOCOMPLETE_INPUT_TEXT).fill(INAT_USERNAME)
      },
    })

    // Search iNaturalist for user
    await pause({
      func: async () => {
        await page.keyboard.press('Enter')
      },
    })

    // Set date for fieldnotes
    await pause({
      func: async () => {
        await page.locator(SINGLE_OBSERVATIONS_INPUT_DATE).fill(INAT_DATE)
      },
    })

    // Search iNaturalist for observations
    await pause({
      func: async () => {
        await page.locator(SEARCH_INAT_OBSERVATIONS_BTN).click()
      },
    })
  } catch (error) {
    await scroll({ page })
    await page.screenshot({
      path: `./public/tests/write-fieldnotes/screenshots/error${Date.now()}.png`,
      fullPage: true,
    })
    console.log(error)
  } finally {
    // await browser.close()
  }
}

writeFieldnotes()
