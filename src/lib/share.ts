import { getGuessStatuses, CharStatus } from './statuses'
import { solutionIndex } from './words'
import { GAME_TITLE } from '../constants/strings'

let maxGenLength = 196;
let includeEmoji = 1;

export const shareStatus = (guesses: string[], lost: boolean) => {
  navigator.clipboard.writeText(
    `${GAME_TITLE} ${solutionIndex} ${lost ? 'X' : guesses.length}/6\n\n` +
      generateEmojiGrid(guesses)
  )
}

export const generateEmojiGrid = (guesses: string[]) => {
   let output = '';
   const descriptiveLines: string[] = [];
   let chopAggression = 0;

   while (chopAggression === 0 || descriptiveLines.join('\n').length + output.length > maxGenLength ) {
         descriptiveLines.splice(0,descriptiveLines.length);
	 guesses.forEach((guess) => {
            descriptiveLines.push(describeLine(guess, descriptiveLines.length + 1, chopAggression));	         });
         if (chopAggression++> 20) break;
  }

  descriptiveLines.forEach((line) => {
    output += line;
  });

  if (includeEmoji) {
    output += '\n';

      output += generateEmojiGridEmoji(guesses);
  }


  return output;
}

const generateEmojiGridEmoji = (guesses: string[]) => {
  return guesses
    .map((guess) => {
      const status = getGuessStatuses(guess)
      return guess
        .split('')
        .map((_, i) => {
          switch (status[i]) {
            case 'correct':
              return '🟦'
            case 'present':
              return '🟧'
            default:
              return '⬜'
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
        }
     actualIndex++;
    }

  return {
    misplacedIndexes: misplacedIndexes,
    perfectIndexes: perfectIndexes,
  };
}