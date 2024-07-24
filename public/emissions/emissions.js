import { browser } from '@danhartley/emissions'

export const getPageEmissions = () => {
  ;(async () => {
    await browser.registerServiceWorker()

    // eslint-disable-next-line no-undef
    const url = window.location.origin
    const options = {
      hostingOptions: {
        verbose: true,
        forceGreen: true,
      },
    }

    const { pageWeight, count, greenHosting, mgCO2, records } =
      await browser.getPageEmissions(url, options)

    console.log(`Report for ${url}`)
    console.log('Page weight: ', `${pageWeight / 1000} Kbs`)
    console.log('Requests ', count)
    console.log('Emissions: ', `${mgCO2} mg of CO2`)
    console.log(
      greenHosting ? 'Hosting: green hosting' : 'Hosting: not green hosting'
    )
    console.log('Records ', records)

    const bytes = records.reduce((acc, curr) => acc + curr.responseBytes, 0)

    console.log('bytes: ', bytes)

    await browser.clearPageEmissions()
  })()
}
