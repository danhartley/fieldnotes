import puppeteer from 'puppeteer'

import { scroll, isEnabled } from '../utils.js'

const DELAY_FOR_TITLES = 1000
const FIREBASE_EMAIL_INPUT_TXT = '#firebase-email'
const FIREBASE_PASSWORD_INPUT_TXT = '#firebase-password'
const FIREBASE_EMAIL = 'readandwrite@learn-the-planet.com'
const FIREBASE_PASSWORD = 'readandwrite'
const AUTHENTICATE_BTN = '#authenticate-btn'
const FIELDNOTES_TITLE_INPUT_TXT = '#fn-autocomplete-title-input-text'
const FIELDNOTES_TITLE = 'Practice notes 1'
const FETCH_FIELDNOTES_BTN = '#fetch-fieldnotes-btn'

const writeFieldnotes = async () => {
  let browser, page = null
  
  try {
    // Launch the browser
    browser = await puppeteer.launch({headless: false})
    // Create a page
    page = await browser.newPage()

    // Set the viewport dimensions
    await page.setViewport({ width: 1640, height: 1024 })

    // Go to read fieldnotes page
    await page.goto('http://localhost:1234/write-fieldnotes.html')

    // Abort test if the fetch button is already enabled
    // if(isEnabled({
    //   classList: await page.$eval(AUTHENTICATE_BTN, el => el.classList)
    // })) {
    //   console.error('The initial state is wrong, aborting test')
    // }

    // Logins the user
    await page.locator(FIREBASE_EMAIL_INPUT_TXT).fill(FIREBASE_EMAIL)
    await page.locator(FIREBASE_PASSWORD_INPUT_TXT).fill(FIREBASE_PASSWORD)
    await page.click(AUTHENTICATE_BTN)

    // Create a new set of fieldnotes
    await page.locator(FIELDNOTES_TITLE_INPUT_TXT).fill(FIELDNOTES_TITLE)

    setTimeout(async() => {
      await page.keyboard.press('Enter')
      await page.click(FETCH_FIELDNOTES_BTN)
    }, DELAY_FOR_TITLES)

  } catch (error) { 
    await scroll({page})
    await page.screenshot({path: './public/tests/read-fieldnotes/screenshots/error.png', fullPage: true})
    console.log(error) 

  } finally {
      // await browser.close()
  }
}

writeFieldnotes()