import { fail } from 'assert'

import { VALID_GUESSESR } from './validGuesses'

describe('valid guesses', () => {
  test('words are unique', () => {
    const uniqueWords = Array.from(new Set(VALID_GUESSESR))

    expect(VALID_GUESSESR.length).toEqual(uniqueWords.length)

    if (uniqueWords.length !== VALID_GUESSESR.length) {
      uniqueWords.forEach((w) => {
        const ww = VALID_GUESSESR.filter((x) => x === w)
        if (ww.length > 1) {
          fail(`The word ${w} is not unique.`)
        }
      })
    }
  })
})
