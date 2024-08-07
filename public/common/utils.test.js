import { isValidDate, sortBy, validateSlug, createSlug } from './utils.js'

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
  const arr = [{ a: 1 }, { a: 2 }, { a: 3 }]
  const sortedAsc = [{ a: 1 }, { a: 2 }, { a: 3 }]
  const sortedDesc = [{ a: 3 }, { a: 2 }, { a: 1 }]

  expect(sortBy({ arr, prop: 'a', dir: 'asc' })).toEqual(sortedAsc)
  expect(sortBy({ arr, prop: 'a', dir: 'desc' })).toEqual(sortedDesc)
})

describe('validateSlug', () => {
  let pathname = '/danielhartley-lisbon-portugal-wed-feb-28-2024'
  let slugs = ['danielhartley-lisbon-portugal-wed-feb-28-2024/']

  it('should return a valid slug', () => {
    expect(validateSlug({ pathname, slugs })).toStrictEqual({
      isValid: true,
      slug: 'danielhartley-lisbon-portugal-wed-feb-28-2024/',
    })
  })

  it('should return an invalid slug when no match for author', () => {
    pathname = '/author-invalid-slug'
    expect(validateSlug({ pathname })).toStrictEqual({
      isValid: false,
      slug: '',
    })
  })
})

describe('createSlug', () => {
  it('should return a valid slug', () => {
    const author = 'danielhartley'
    const location = {
      location: '38.5295111111,-8.9828722222',
      place_guess: 'Lisbon, Portugal',
    }
    const date = new Date('2024-02-28')
    const slug = 'danielhartley-lisbon-portugal-wed-feb-28-2024/'
    expect(createSlug({ author, location, date })).toBe(slug)
  })
})
