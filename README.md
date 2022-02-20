Doctor Whordle

This Doctor Who themed version of wordle is adapted from cwackerfuss/hanahcode's clone project of the popular word guessing game made using React, Typescript, and Tailwind.

_To Run Locally:_
Clone the repository and perform the following command line actions:

```bash
$ cd word-guessing-game
$ npm install
$ npm run start
```

_To build/run docker container:_

```bash
$ docker build -t game .
$ docker run -d -p 3000:3000 game
```

open http://localhost:3000 in browser.

_To create a version in a different language/on a different theme:_

- Update the title, the description, and the "You need to enable JavaScript" message in `public/index.html`
- Update the language attribute in the HTML tag in `public/index.html`
- Update the name and short name in `public/manifest.json`
- Update the strings in `src/constants/strings.ts`
- Add all of the five letter words in the language to `src/constants/validGuesses.ts`, replacing the English words
- Add a list of goal words and explanationw in the language to `src/constants/wordlist.ts`, replacing the English words
- If the language has letters that are not present in English, add them to the `CharValue` type in `src/lib/statuses.ts` and update the keyboard in `src/lib/components/keyboard/Keyboard.tsx`
- If the language's letters are made of multiple unicode characters, use a grapheme splitter at various points throughout the app or normalize the input so that all of the letters are made of a single character
- If the language is written right-to-left, prepend `\u202E` (the unicode right-to-left override character) to the return statement of the inner function in `generateEmojiGrid` in [src/lib/share.ts](src/lib/share.ts)

### How can I add usage tracking?

This repository includes support for Google Analytics or [Plausible Analytics](https://plausible.io), but, by default, this is disabled.

To enable Google Analytics:

- Create a Google Analytics 4 property and obtain the measurement ID (of the format `G-XXXXXXXXXX`)
- In [.env](.env), add `REACT_APP_GOOGLE_MEASUREMENT_ID=G-XXXXXXXXXX`

Keep in mind that your region might have legislation about obtaining a user's consent before enabling trackers. This is up to downstream repos to implement.

To enable Plausible Analytics:

- Create a new website with Plausible Analytics with a given domain, e.g. `example.app`
- In [.env](.env), add `REACT_APP_PLAUSIBLE_DOMAIN=example.app`
