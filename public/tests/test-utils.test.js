import { pause, getDomainFromURL } from './test-utils.js'

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

describe('getDomainFromURL function', () => {
  let url1 = 'https://ifieldnotes.org/sustainability?qs=qsvalue'
  let domain1 = getDomainFromURL({url:url1})
  expect(domain1).toEqual('ifieldnotes.org')
  let url2 = 'https://smth.uk/'
  let domain2 = getDomainFromURL({url:url2})
  expect(domain2).toEqual('smth.uk')
  let url3 = 'bbcorp.fr  '
  let domain3 = getDomainFromURL({url:url3})
  expect(domain3).toEqual('bbcorp.fr')
})