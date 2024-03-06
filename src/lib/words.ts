import { WORDSDICT } from '../constants/wordlist'
import { WORDSDICT5 } from '../constants/wordlist_5'
import { VALID_GUESSES } from '../constants/validGuesses'
import { VALID_GUESSES5 } from '../constants/validGuesses5'
import { MOREWORDS } from '../constants/morewords'
import { MOREWORDS5 } from '../constants/morewords_5'
import { WRONG_SPOT_MESSAGE, NOT_CONTAINED_MESSAGE } from '../constants/strings'
import { getGuessStatuses } from './statuses'
import {
  addDays,
  differenceInDays,
  formatISO,
  parseISO,
  startOfDay,
} from 'date-fns'
import { default as GraphemeSplitter } from 'grapheme-splitter'
import queryString from 'query-string'

import { ENABLE_ARCHIVED_GAMES } from '../constants/settings'

// 1 January 2022 Game Epoch
export const firstGameDate = new Date('April 5, 2023 00:00:00')
export const periodInDays = 1

export const isWordInWordList = (word: string) => {
  const WORDS = Object.keys(WORDSDICT)
  return (
    WORDS.includes(word.toLowerCase()) ||
    MOREWORDS.includes(word.toLowerCase()) ||
    VALID_GUESSES.includes(word.toLowerCase()) 
  )
}

export const isWordInWordList5 = (word: string) => {
  const WORDS5 = Object.keys(WORDSDICT5)
  return (
    WORDS5.includes(word.toLowerCase()) ||
    MOREWORDS5.includes(word.toLowerCase()) ||
    VALID_GUESSES5.includes(word.toLowerCase()) 
  )
}

export const isWinningWord = (word: string) => {
  return solution === word
}


// build a set of previously revealed letters - present and correct
// guess must use correct letters in that space and any other revealed letters
// also check if all revealed instances of a letter are used (i.e. two C's)
export const findFirstUnusedReveal = (word: string, guesses: string[]) => {
  if (guesses.length === 0) {
    return false
  }

  const lettersLeftArray = new Array<string>()
  const guess = guesses[guesses.length - 1]
  const statuses = getGuessStatuses(solution, guess)
//  const statuses5 = getGuessStatuses(solution5, guess)
  const splitWord = unicodeSplit(word)
  const splitGuess = unicodeSplit(guess)

  for (let i = 0; i < splitGuess.length; i++) {
    if (statuses[i] === 'correct' || statuses[i] === 'present') {
      lettersLeftArray.push(splitGuess[i])
    }
    if (statuses[i] === 'correct' && splitWord[i] !== splitGuess[i]) {
      return WRONG_SPOT_MESSAGE(splitGuess[i], i + 1)
    }
  }

  // check for the first unused letter, taking duplicate letters
  // into account - see issue #198
  let n
  for (const letter of splitWord) {
    n = lettersLeftArray.indexOf(letter)
    if (n !== -1) {
      lettersLeftArray.splice(n, 1)
    }
  }

  if (lettersLeftArray.length > 0) {
    return NOT_CONTAINED_MESSAGE(lettersLeftArray[0])
  }
  return false
}

export const unicodeSplit = (word: string) => {
  return new GraphemeSplitter().splitGraphemes(word)
}

export const unicodeLength = (word: string) => {
  return unicodeSplit(word).length
}

export const localeAwareLowerCase = (text: string) => {
  return process.env.REACT_APP_LOCALE_STRING
    ? text.toLocaleLowerCase(process.env.REACT_APP_LOCALE_STRING)
    : text.toLowerCase()
}

export const localeAwareUpperCase = (text: string) => {
  return process.env.REACT_APP_LOCALE_STRING
    ? text.toLocaleUpperCase(process.env.REACT_APP_LOCALE_STRING)
    : text.toUpperCase()
}

export const getWordOfDay = (index: number) => {
  if (index < 0) {
    throw new Error('Invalid index')
  }
  // February 6, 2022 Game Epoch
//  const now = Date.now()
//  const msInDay = 86400000
//  const index = Math.floor((now - epochMs) / msInDay)
//  const nextday = (index + 1) * msInDay + epochMs
  const WORDS = Object.keys(WORDSDICT)
  return localeAwareUpperCase(WORDS[index % WORDS.length])
}

export const getRandomWord = (index: number) => {
  if (index < 0) {
    throw new Error('Invalid index')
  }
  const WORDS = Object.keys(WORDSDICT5)
  return localeAwareUpperCase(WORDS[index % WORDS.length])
}

export const getRandomWordIndex = () => {
  const WORDS = Object.keys(WORDSDICT5)
  const index = Math.floor(Math.random()*WORDS.length)
  return index
}

export const getRandomExplanation = (index : number) => {
  if (index < 0) {
    throw new Error('Invalid index')
  }

  const WORDS5 = Object.keys(WORDSDICT5)
  const explanations5 = Object.values(WORDSDICT5)
  return explanations5[index % WORDS5.length]
}

export const getToday = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}



export const getLastGameDate = (today: Date) => {
  const t = startOfDay(today)
  let daysSinceLastGame = differenceInDays(firstGameDate, t) % periodInDays
  return addDays(t, -daysSinceLastGame)
}

export const getNextGameDate = (today: Date) => {
  return addDays(getLastGameDate(today), periodInDays)
}

export const isValidGameDate = (date: Date) => {
  if (date < firstGameDate || date > getToday()) {
    return false
  }

  return differenceInDays(firstGameDate, date) % periodInDays === 0
}

export const getIndex = (gameDate: Date) => {
  let start = firstGameDate
  let index = -1
  do {
    index++
    start = addDays(start, periodInDays)
  } while (start <= gameDate)

  return index
}

export const getSolution = (gameDate: Date) => {
  const nextGameDate = getNextGameDate(gameDate)
  const index = getIndex(gameDate)
  const wordOfTheDay = getWordOfDay(index)
  const randomWordIndex = getRandomWordIndex()
  const randomWord = getRandomWord(randomWordIndex)
  const WORDS = Object.keys(WORDSDICT)
  const WORDS5 = Object.keys(WORDSDICT5)
  const explanations = Object.values(WORDSDICT)
  const explanations5 = Object.values(WORDSDICT5)
  
  return {
    solution: wordOfTheDay,
    solution5: randomWord,
    solutionGameDate: gameDate,
    solutionIndex: index,
//    tomorrow: nextday,
    explanation: explanations[index % WORDS.length],
    explanation5: explanations5[randomWordIndex % WORDS5.length],
    tomorrow: nextGameDate.valueOf(),
  }
}

export const getGameDate = () => {
  if (getIsLatestGame()) {
    return getToday()
  }

  const parsed = queryString.parse(window.location.search)
  try {
    const d = startOfDay(parseISO(parsed.d!.toString()))
    if (d >= getToday() || d < firstGameDate) {
      setGameDate(getToday())
    }
    return d
  } catch (e) {
    console.log(e)
    return getToday()
  }
}

export const setGameDate = (d: Date) => {
  try {
    if (d < getToday()) {
      window.location.href = '/?d=' + formatISO(d, { representation: 'date' })
      return
    }
  } catch (e) {
    console.log(e)
  }
  window.location.href = '/'
}

export const getIsLatestGame = () => {
  if (!ENABLE_ARCHIVED_GAMES) {
    return true
  }
  const parsed = queryString.parse(window.location.search)
  return parsed === null || !('d' in parsed)
}

export const { solution, solution5, solutionGameDate, solutionIndex, tomorrow, explanation, explanation5 } =
  getSolution(getGameDate())
