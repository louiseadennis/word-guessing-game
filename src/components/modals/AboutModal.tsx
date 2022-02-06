import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const AboutModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal title="About" isOpen={isOpen} handleClose={handleClose}>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Doctor Whordle is an open source Doctor Who themed word guessing game by Louise Dennis.  It is based on the popular Worlde game by Josh Wardle.  It uses work by Hannah Park (base game code) and Cariad Eccleston (accessibility features for posting to Twitter) -{' '}
        <a
          href="https://github.com/louiseadennis/word-guessing-game"
          className="underline font-bold"
        >
          check out the code here
        </a>{' '}
      </p>
    </BaseModal>
  )
}
