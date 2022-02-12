import { WORDSDICT } from '../constants/wordlist'
import { VALIDGUESSES } from '../constants/validGuesses'
import { MOREWORDS } from '../constants/morewords'

export const isWordInWordList = (word: string) => {
  const WORDS = Object.keys(WORDSDICT)
  return (
    WORDS.includes(word.toLowerCase()) ||
    MOREWORDS.includes(word.toLowerCase()) ||
    VALIDGUESSES.includes(word.toLowerCase()) 
  )
}

export const isWinningWord = (word: string) => {
  return solution === word
}

export const getWordOfDay = () => {
  // February 6, 2022 Game Epoch
  const epochMs = new Date('February 6, 2022 00:00:00').valueOf()
  const now = Date.now()
  const msInDay = 86400000
  const index = Math.floor((now - epochMs) / msInDay)
  const nextday = (index + 1) * msInDay + epochMs
  const WORDS = Object.keys(WORDSDICT)
  const explanations = Object.values(WORDSDICT)

  return {
    solution: WORDS[index % WORDS.length].toUpperCase(),
    solutionIndex: index,
    tomorrow: nextday,
    explanation: explanations[index % WORDS.length]
  }
}

export const { solution, solutionIndex, tomorrow, explanation } = getWordOfDay()
