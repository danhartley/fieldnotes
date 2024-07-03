import { helloCalculator, registerServiceWorker, getNetworkTraffic} from '@danhartley/emissions'

export const getEmissions = () => {
  (async () => {
    registerServiceWorker()
    helloCalculator()
  
    const records = await getNetworkTraffic()
    if(records.length) {
        let bytes = records.reduce((acc, curr) => acc + curr.responseBytes, 0)
        console.log('kilobytes: ', bytes / 1000)
    }
  })() 
}