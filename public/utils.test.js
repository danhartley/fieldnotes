import { isValidDate } from './utils.js'

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