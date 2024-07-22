import puppeteer from 'puppeteer'

import { node } from '@danhartley/emissions'
import { logEmissions } from '../test-utils.js'
import { config } from '../test-config.js'

const parseEmissions = async (page, url) => {
  const options = {
    hostingOptions: {
      verbose: false,
      forceGreen: true,
    },
  }

  const {
    pageWeight,
    count,
    emissions,
    greenHosting,
    data,
    domain,
    responses,
  } = await node.getPageEmissions(page, url, options)

  logEmissions({
    url,
    pageWeight,
    count,
    emissions,
    greenHosting,
    data,
    domain,
    responses,
  })
}

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    defaultViewport: null,
  })

  
  const page = await browser.newPage()
  
  await page.setViewport({
    width: config.viewport.desktop.width, 
    height: config.viewport.desktop.height
  })

  const url = 'http://localhost:3003'

  await parseEmissions(page, url)
  await browser.close()
})()
