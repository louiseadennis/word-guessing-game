import { getGuessStatuses, CharStatus } from './statuses'
import { solutionIndex } from './words'
import { GAME_TITLE } from '../constants/strings'
import { MAX_CHALLENGES } from '../constants/settings'
import { UAParser } from 'ua-parser-js'

const webShareApiDeviceTypes: string[] = ['mobile', 'smarttv', 'wearable']
const parser = new UAParser()
const browser = parser.getBrowser()
const device = parser.getDevice()

let maxGenLength = 196;

export const shareStatus = (
  guesses: string[],
  lost: boolean,
  isHardMode: boolean,
  isDarkMode: boolean,
  isHighContrastMode: boolean,
  handleShareToClipboard: () => void
) => {
  const textToShare =
    `${GAME_TITLE} ${solutionIndex} ${
      lost ? 'X' : guesses.length
    }/${MAX_CHALLENGES}${isHardMode ? '*' : ''}\n\n` +
      generateEmojiGrid(guesses, getEmojiTiles(isDarkMode, isHighContrastMode))
      + '\n https://louiseadennis.github.io/doctor-whordle'

  const shareData = { text: textToShare }

  let shareSuccess = false

  try {
    if (attemptShare(shareData)) {
      navigator.share(shareData)
      shareSuccess = true
    }
  } catch (error) {
    shareSuccess = false
  }

  if (!shareSuccess) {
    navigator.clipboard.writeText(textToShare)
    handleShareToClipboard()
  }

}

export const shareStatusText = (
  guesses: string[],
  lost: boolean,
  isHardMode: boolean,
  isDarkMode: boolean,
  isHighContrastMode: boolean,
  handleShareToClipboard: () => void
) => {
  const textToShare =
    `${GAME_TITLE} ${solutionIndex} ${
      lost ? 'X' : guesses.length
    }/${MAX_CHALLENGES}${isHardMode ? '*' : ''}\n\n` +
      generateGrid(guesses)
      + '\n https://louiseadennis.github.io/doctor-whordle'

    const shareData = { text: textToShare }

  let shareSuccess = false

  try {
    if (attemptShare(shareData)) {
      navigator.share(shareData)
      shareSuccess = true
    }
  } catch (error) {
    shareSuccess = false
  }

  if (!shareSuccess) {
    navigator.clipboard.writeText(textToShare)
    handleShareToClipboard()
  }
}

export const generateEmojiGrid = (guesses: string[], tiles:string []) => {
   let output = '';
   const descriptiveLines: string[] = [];

   for (let chopAggression = 0; chopAggression < 21; chopAggression++ ) {
         descriptiveLines.splice(0,descriptiveLines.length);
	 guesses.forEach((guess) => {
            descriptiveLines.push(describeLine(guess, descriptiveLines.length + 1, chopAggression));	         });
	 if (descriptiveLines.join('\n').length + output.length > maxGenLength) break;
  }

  descriptiveLines.forEach((line) => {
    output += line;
  });

 output += '\n';
 output += generateEmojiGridEmoji(guesses, tiles);

  return output;
}

export const generateGrid = (guesses: string[]) => {
   let output = '';
   const descriptiveLines: string[] = [];

   for (let chopAggression = 0; chopAggression < 21; chopAggression++ ) {
         descriptiveLines.splice(0,descriptiveLines.length);
	 guesses.forEach((guess) => {
            descriptiveLines.push(describeLine(guess, descriptiveLines.length + 1, chopAggression));	         });
	 if (descriptiveLines.join('\n').length + output.length > maxGenLength) break;
  }

  descriptiveLines.forEach((line) => {
    output += line;
  });

  return output;
}

const generateEmojiGridEmoji = (guesses: string[], tiles:string[]) => {
  return guesses
    .map((guess) => {
      const status = getGuessStatuses(guess)
      return guess
        .split('')
        .map((_, i) => {
          switch (status[i]) {
            case 'correct':
              return tiles[0]
            case 'present':
              return tiles[1]
            default:
              return tiles[2]
          }
        })
        .join('')
    })
    .join('\n')
}

const ord = (i:number) => {
  switch (i) {
    case 1: return '1st';
    case 2: return '2nd';
    case 3: return '3rd';
    default: return `${i}th`
  }
}

const describe = (indexes:number[]) => {
  if (indexes.length === 0) return null;

  const ords = indexes.map((i) => ord(i));

  if (ords.length === 1) return ords[0];

  return ords.reduce(
    (text, value, i, array) => {
      return text + (i < array.length - 1 ? ', ' : ' and ') + value;
    })
};

const describeLine = (guess:string, num:number, chopAggression:number) => {
  const status = getGuessStatuses(guess);
  const decoded = blockTypes(status);

  const hasPerfect = decoded.perfectIndexes.length > 0;
  const hasMisplaced = decoded.misplacedIndexes.length > 0;

  const perfectWord = chopAggression >= 8 ? 'yes' : 'perfect';
  const perfect = hasPerfect ? `${describe(decoded.perfectIndexes)} ${perfectWord}` : null;

  const misplacedList = describe(decoded.misplacedIndexes);

  const wrongPlace = chopAggression >= 6 ? chopAggression >= 7 ? 'no' : 'wrong' : 'in the wrong place';
  const correctBut = chopAggression >= 3 ? `${misplacedList} ${wrongPlace}` : `${misplacedList} correct but ${wrongPlace}`;
  const perfectBut = chopAggression >= 2 ? `. ${misplacedList} ${wrongPlace}` : `, but ${misplacedList} ${wrongPlace}`

  const misplaced = hasPerfect ? perfectBut : correctBut;

  let explanation = '';

  if (!hasPerfect && !hasMisplaced)
    explanation = 'Nothing.';
  else if (decoded.perfectIndexes.length === 5)
    explanation = 'Won!';
  else if (decoded.misplacedIndexes.length === 5)
    explanation = chopAggression >= 1 ? 'all in the wrong order.' : 'all the correct letters but in the wrong order.';
  else if (hasPerfect && hasMisplaced)
    explanation = `${perfect}${misplaced}.`
  else if (hasMisplaced)
    explanation = `${misplaced}.`
  else
    explanation = `${perfect}.`

  const prefix = chopAggression >= 5 ? `${num}.` : `Line ${num}:`;

  const result = `${prefix} ${explanation}\n`

  if (chopAggression >= 4)
    return result.replaceAll(' and ', ' & ');

  return result;
}


const blockTypes = (status: CharStatus[]) => {
  let actualIndex = 0;
  let visualIndex = 1;

  const misplacedIndexes = [];
  const perfectIndexes = [];

  while (actualIndex < status.length) {
    switch (status[actualIndex]) {
    	   case 'present':
              misplacedIndexes.push(visualIndex++);
              break;
          case 'correct':
            perfectIndexes.push(visualIndex++);
            break;
	  default:
	    visualIndex++;
        }
     actualIndex++;
    }

  return {
    misplacedIndexes: misplacedIndexes,
    perfectIndexes: perfectIndexes,
  };
}

const attemptShare = (shareData: object) => {
  return (
    // Deliberately exclude Firefox Mobile, because its Web Share API isn't working correctly
    browser.name?.toUpperCase().indexOf('FIREFOX') === -1 &&
    webShareApiDeviceTypes.indexOf(device.type ?? '') !== -1 &&
    navigator.canShare &&
    navigator.canShare(shareData) &&
    navigator.share
  )
}

const getEmojiTiles = (isDarkMode: boolean, isHighContrastMode: boolean) => {
  let tiles: string[] = []
  tiles.push(isHighContrastMode ? '🟦' : '🟦')
  tiles.push(isHighContrastMode ? '🟧' : '🟧')
  tiles.push(isDarkMode ? '⬜️' : '⬜️')
  return tiles
}
