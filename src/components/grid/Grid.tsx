import { CompletedRow } from './CompletedRow'
import { CurrentRow } from './CurrentRow'
import { EmptyRow } from './EmptyRow'

type Props = {
  solution: string
  guesses: string[]
  currentGuess: string
  isRevealing?: boolean
  currentRowClassName: string
  wordLength: number
  challenges: number
}

export const Grid = ({
  solution,
  guesses,
  currentGuess,
  isRevealing,
  currentRowClassName,
  wordLength,
  challenges
}: Props) => {

  const empties =
    guesses.length < challenges
      ? Array.from(Array(challenges - guesses.length - 1))
      : []

  console.log("grid data")
  console.log(wordLength)
  console.log(solution)
  console.log(challenges)
  console.log(guesses.length)
 

  return (
    <>
      {guesses.map((guess, i) => (
        <CompletedRow
          key={i}
          solution={solution}
          guess={guess}
          isRevealing={isRevealing && guesses.length - 1 === i}
        />
      ))}
      {guesses.length < challenges && (
        <CurrentRow guess={currentGuess} className={currentRowClassName} solution={solution} />
      )}
      {empties.map((_, i) => (
        <EmptyRow key={i} solution={solution}/>
      ))}
    </>
  )
}
