import puppeteer from 'puppeteer'

const DELAY = 1000
const FIELDNOTES = 'Streets of Lisbon, Portugal, Wed Feb 28 2024'

const readFieldnotes = async () => {
  let browser, page, classList = null
  
  try {
    // Launch the browser and open a new blank page
    browser = await puppeteer.launch({headless: false})
    page = await browser.newPage()

    await page.setViewport({ width: 1280, height: 1024 })

    // Navigate the page to read fieldnotes
    await page.goto('http://localhost:1234')  
    
    // Abort test if the fetch button is already enabled
    const classList = await page.$eval('#fetch-fieldnotes-btn', el => el.classList)
    if(isEnabled({classList})) {
      console.error('The initial state is wrong, aborting test')
    }

    // Populate fieldnotes to display
    await page.locator('#fn-autocomplete-title-input-text').fill(FIELDNOTES) 

    setTimeout(async() => {
      // Trigger selection of the entered fieldnotes
      await page.keyboard.press('Enter')

      // Fetch fieldnotes if the fetch button is enabled
      const classList = await page.$eval('#fetch-fieldnotes-btn', el => el.classList)
      if(isEnabled({classList})) {
        await page.click('#fetch-fieldnotes-btn')
      } else {
        await page.screenshot({path: './public/tests/read-fieldnotes/screenshots/fetch button not ready.png', fullPage: true})
      }              
    }, DELAY)    
  } catch (error) { 
    await scroll({page})
    await page.screenshot({path: './public/tests/read-fieldnotes/screenshots/error.png', fullPage: true})
    console.log(error) 

  } finally {
    setTimeout(async() => {
      // await browser.close()
  } , DELAY + 2000)
  }
}

readFieldnotes()

const scroll = async ({page}) => {
  return await page.evaluate(async () => {
      return await new Promise((resolve, reject) => {
          var i = setInterval(() => {
              window.scrollBy(0, window.innerHeight)
              if (
                  document.scrollingElement.scrollTop + window.innerHeight >=
                  document.scrollingElement.scrollHeight
              ) {
                  window.scrollTo(0, 0)
                  clearInterval(i)
                  resolve()
              }
          }, 100)
      })
  })
}

const hasClass = ({classList, className}) => {  
  const classNames = []
  Object.keys(classList).forEach(key => {
    classNames.push(classList[key])
  })
  
  const isTrue = classNames.includes(className)

  if(isTrue) {
    console.log(`The CSS class "${className}" was in the classList`)
  } else {
    console.log(`The CSS class "${className}" was not in the classList`)
  }
  
  return isTrue
}

const isDisabled = ({classList}) => {
  return hasClass({
      classList
    , className: 'disabled'
  })
}

const isEnabled = ({classList}) => {
  return !hasClass({
      classList
    , className: 'disabled'
  })
}

/**
 * helper classes
 * logger
 * snapshots for errors
 * error handling
 * suite of tests (how comprehensive?)
 * reset the database i.e. when creating entires such as user and field notes
 */