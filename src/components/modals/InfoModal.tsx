import { Cell } from '../grid/Cell'
import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const InfoModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal title="How to play" isOpen={isOpen} handleClose={handleClose}>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Guess the word in 6 tries. After each guess, the color of the tiles will
        change to show how close your guess was to the word.
      </p>

      <div className="mb-1 mt-4 flex justify-center">
        <Cell
          isRevealing={true}
          isCompleted={true}
          value="T"
          status="correct"
        />
        <Cell value="A" isCompleted={true} />
        <Cell value="R" isCompleted={true} />
        <Cell value="D" isCompleted={true} />
        <Cell value="I" isCompleted={true} />
        <Cell value="S" isCompleted={true} />
     </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The letter T is in the word and in the correct spot.
      </p>

      <div className="mb-1 mt-4 flex justify-center">
        <Cell value="D" isCompleted={true} />
        <Cell value="O" isCompleted={true} />
        <Cell
          isRevealing={true}
          isCompleted={true}
          value="C"
          status="present"
        />
        <Cell value="T" isCompleted={true} />
        <Cell value="O" isCompleted={true} />
        <Cell value="R" isCompleted={true} />
   </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The letter C is in the word but in the wrong spot.
      </p>

      <div className="mb-1 mt-4 flex justify-center">
        <Cell value="P" isCompleted={true} />
        <Cell value="O" isCompleted={true} />
        <Cell value="L" isCompleted={true} />
        <Cell isRevealing={true} isCompleted={true} value="I" status="absent" />
        <Cell value="C" isCompleted={true} />
        <Cell value="E" isCompleted={true} />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The letter I is not in the word in any spot.
      </p>

      <p className="text-sm text-gray-500 dark:text-gray-300">
        Doctor Whordle is an open source Doctor Who themed word guessing game by Louise Dennis.  It is based on the popular Wordle game by Josh Wardle.  It uses work by Chase Wackerfuss and Hannah Park (base game code) and Cariad Eccleston (accessibility features for posting to Twitter) -{' '}
        <a
          href="https://github.com/louiseadennis/doctor-whordle"
          className="underline font-bold"
        >
          check out the code here
        </a>{' '}
      </p>
    </BaseModal>
  )
}
