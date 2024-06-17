
# Emissions tracker

Monitor the carbon emissions of websites and web apps. 

The emissions tracker has 2 dependencies:
- [@tgwf/co2](https://github.com/thegreenwebfoundation/co2.js/)
- [puppeteer](https://github.com/puppeteer/puppeteer)

```
npm install @tgwf/co2
npm i puppeteer
npm install emissions-tracker
```


## Integration tests

Create a new integration test with puppeteer. Create a new instance of the EmissionsTracker and call its public method, getReport.

If you want to include lighthouse values in your report, include lighthouse

```
import puppeteer from 'puppeteer'
import lighthouse from 'lighthouse'
import { EmissionsTracker } from './emissions-tracker.js'

const testSite = async () => {

    // Launch the browser
    const browser = await puppeteer.launch({
        headless: false
    })

    // Create a page
    const page = await browser.newPage()

    // Specify options
    const options = {…}

    // Create a new instance of the emissions tracker
    const emissionsTracker = new EmissionsTracker({ page, options })
    
    // Navigate to site
    await page.goto('https://www.example.com/')

    // Run the report
    const { summary, details } = await emissionsTracker.getReport()

    // Log the summary or details objects…
}


```

## Lighthouse

You can include lighthouse reports.

```
import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'
```

## Flags

- -v or --verbose
- -u or --url
- -lh or --lighthouse

### Parsing command line flags

```
  const verboseArgs = ['-v', '--verbose']
  const urlArgs = ['-u', '--url']
  const lighthouseArgs = ['-lh', '--lighthouse']

  process.argv.forEach((val, index) => { 
      if(verboseArgs.includes(val)) verbose = true
      if(lighthouseArgs.includes(val)) runLighthouse = true
      if(urlArgs.includes(val)) {
        const nextArg = index + 1
        if(nextArg < process.argv.length) {
          url = process.argv[nextArg]
          domain = getDomainFromURL({url})
        }
      }
  })
  ```

## References

[Estimating Digital Emissions | Sustainable Web Design](https://sustainablewebdesign.org/estimating-digital-emissions/)

[Web Performance Recipes With Puppeteer | Addy Osmani
](https://addyosmani.com/blog/puppeteer-recipes/)

// curl -X 'GET' \
//  'https://api.thegreenwebfoundation.org/api/v3/greencheck/bbc.co.uk' \
//  -H 'accept: application/json'