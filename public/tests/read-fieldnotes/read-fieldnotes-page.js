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

  const { bytes, count, emissions, greenHosting, data, domain } =
    await node.getPageEmissions(page, url, options)

  logEmissions({
    url,
    bytes,
    count,
    emissions,
    greenHosting,
    data,
    domain,
  })
}

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  })

  const page = await browser.newPage()

  await page.setViewport({
    width: config.viewport.desktop.width,
    height: config.viewport.desktop.height,
  })

  const url = 'http://localhost:3007/read-fieldnotes'

  await parseEmissions(page, url)
  await browser.close()
})()
