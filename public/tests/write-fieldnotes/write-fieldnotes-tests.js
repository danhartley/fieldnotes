import puppeteer from 'puppeteer'

import { scroll, isEnabled } from '../utils.js'

const FIREBASE_EMAIL_INPUT_TXT = '#firebase-email'
const FIREBASE_PASSWORD_INPUT_TXT = '#firebase-password'
const FIREBASE_EMAIL = 'readandwrite@learn-the-planet.com'
const FIREBASE_PASSWORD = 'readandwrite'
const AUTHENTICATE_BTN = '#authenticate-btn'

const writeFieldnotes = async () => {
  let browser, page = null
  
  try {
    // Launch the browser
    browser = await puppeteer.launch({headless: false})
    // Create a page
    page = await browser.newPage()

    // Set the viewport dimensions
    await page.setViewport({ width: 1280, height: 1024 })

    // Go to read fieldnotes page
    await page.goto('http://localhost:1234/write-fieldnotes.html')

    // Abort test if the fetch button is already enabled
    if(isEnabled({
      classList: await page.$eval(AUTHENTICATE_BTN, el => el.classList)
    })) {
      console.error('The initial state is wrong, aborting test')
    }

    await page.locator(FIREBASE_EMAIL_INPUT_TXT).fill(FIREBASE_EMAIL)
    await page.locator(FIREBASE_PASSWORD_INPUT_TXT).fill(FIREBASE_PASSWORD)

  } catch (error) { 
    await scroll({page})
    await page.screenshot({path: './public/tests/read-fieldnotes/screenshots/error.png', fullPage: true})
    console.log(error) 

  } finally {
      // await browser.close()
  }
}

writeFieldnotes()