import { getDomainFromURL } from './emissions-tracker-utils'

describe('getDomainFromURL function', () => {
  let url1 = 'https://ifieldnotes.org/sustainability?qs=qsvalue'
  let domain1 = getDomainFromURL({url:url1})
  expect(domain1).toEqual('ifieldnotes.org')
  let url2 = 'https://smth.uk/'
  let domain2 = getDomainFromURL({url:url2})
  expect(domain2).toEqual('smth.uk')
  let url3 = 'bbcorp.fr'
  let domain3 = getDomainFromURL({url:url3})
  expect(domain3).toEqual('bbcorp.fr')
  let url4 = 'https://www.understood.org/'
  let domain4 = getDomainFromURL({url:url4})
  expect(domain4).toEqual('understood.org')
  let url5 = 'https://www.bbc.co.uk'
  let domain5 = getDomainFromURL({url:url5})
  expect(domain5).toEqual('bbc.co.uk')
})