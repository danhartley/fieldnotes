import { registerServiceWorker, getNetworkTraffic, getEmissions } from '@danhartley/emissions'

export const getSiteEmissions = () => {
  (async () => {
    registerServiceWorker()
  
    const domain = window.location.host
    console.log(domain)
    const traffic = await getNetworkTraffic({domain})
    console.log(traffic)

    if(traffic.responses.length) {
        let bytes = traffic.responses.reduce((acc, curr) => acc + curr.responseBytes, 0)
        console.log('kilobytes: ', bytes / 1000)
        const emissions = await getEmissions({
          bytes,
          model: '1byte',
          hostingOptions: {
            domain
          }
        })

        console.log('total emissions: ', `${emissions.emissions * 1000} mg of CO2`)
        console.log(emissions.isGreen ? `${domain} is green hosted` : `${domain} is not green hosted`)
    }
  })() 
}