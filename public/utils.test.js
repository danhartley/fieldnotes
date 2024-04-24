import { isValidDate, sortBy, validateSlug } from './utils.js'

describe('isValidDate', () => {
  it('should return true when the date parameter is a valid date', () => {
    const validDate = '2023-02-01'
    expect(isValidDate({ date: validDate })).toBe(true)
  })

  it('should return false when the date parameter is an invalid date', () => {
    const invalidDate = 'not-a-date'
    expect(isValidDate({ date: invalidDate })).toBe(false)
  })
})

test('sortBy', () => {
  const arr = [{a: 1}, {a: 2}, {a: 3}]
  const sortedAsc = [{a: 1}, {a: 2}, {a: 3}]
  const sortedDesc = [{a: 3}, {a: 2}, {a: 1}]

  expect(sortBy({arr, prop: 'a', dir: 'asc'})).toEqual(sortedAsc)
  expect(sortBy({arr, prop: 'a', dir: 'desc'})).toEqual(sortedDesc)
})

describe('validateSlug', () => {
  let pathname = '/danielhartley-lisbon-portugal-wed-feb-28-2024'
  let author = 'danielhartley'

  it('should return a valid slug', () => {
    expect(validateSlug({pathname, author})).toStrictEqual({
        isValid: true
      , slug: 'danielhartley-lisbon-portugal-wed-feb-28-2024/'
      , author
    })
  })

  it('should return an invalid slug when no match for author', () => {
    pathname = '/author-invalid-slug'
    author = 'unknown'
    expect(validateSlug({pathname, author})).toStrictEqual({
        isValid: false
      , slug: ''
      , author
    })
  })
})