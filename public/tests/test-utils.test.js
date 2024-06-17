import { pause } from './test-utils.js'

describe('pause function', () => {

  const pauses = []

  test('runs in order', async () => {    
    const pause1 = await pause({
    func: async () => {
        return 'pause 1'
      },
      delay: 3000
    })

    pauses.push(pause1)
    
    const pause2 = await pause({
    func: async () => {
        return 'pause 2'
      },
      delay: 200
    })

    pauses.push(pause2)
    
    const pause3 = await pause({
    func: async () => {
        return 'pause 3'
      },
      delay: 100
    })

    pauses.push(pause3)

    await expect(pauses[0]).toEqual('pause 1')
    await expect(pauses[1]).toEqual('pause 2')
    await expect(pauses[2]).toEqual('pause 3')
  })
})