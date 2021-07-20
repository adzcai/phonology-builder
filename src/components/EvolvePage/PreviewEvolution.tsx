import React, { ReactNode } from 'react';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { allDiacritics, allSounds } from '../../assets/ipa-data';
import { Features, Matrix } from '../../lib/types';
import {
  featureListToFeatures, findIndexOfMatrices, filterSounds, sortSoundsBySimilarityTo,
  canApplyDiacriticsToFeatures,
  replaceConfusables,
} from '../../lib/util';

const stringToFeatures = (word: string): Features[] => replaceConfusables(word).split('')
  .reduce((prev, char) => {
    const diacritic = allDiacritics.find((dc) => dc.symbol === char);
    if (diacritic) {
      const prevFeatures = prev.pop();
      if (!canApplyDiacriticsToFeatures([diacritic], prevFeatures)) {
        alert(`illegal word ${word} has invalid diacritics`);
        return prev;
      }
      return [
        ...prev, { ...prevFeatures, ...diacritic.features },
      ];
    }

    const sound = allSounds.find((segment) => segment.symbol === char);
    if (!sound) {
      alert(`word "${word}" has non-IPA characters: ${char}`);
      return prev;
    }
    return [
      ...prev, sound.features,
    ];
  }, []);

  type ReplacementState = { wordIndex: number; data: ReactNode[]; };

const transformWord = (word: string, src: Matrix[], dst: Matrix[]) => {
  // turn word into a list of feature matrices
  const wordMatrices = stringToFeatures(word);
  const srcMatrices = src.map((matrix) => (typeof matrix.data === 'string' ? matrix.data : featureListToFeatures(matrix.data)));
  const dstMatrices = dst.map((matrix) => (typeof matrix.data === 'string' ? matrix.data : featureListToFeatures(matrix.data)));
  const realSrcMatrices = srcMatrices.filter((val) => typeof val !== 'string') as Partial<Features>[];
  const foundIndex = findIndexOfMatrices(wordMatrices, realSrcMatrices);

  if (foundIndex < 0) {
    return (
      <li key={word}>
        {word}
        {' '}
        not found
      </li>
    );
  }

  const nCharsMatched = realSrcMatrices.length;
  const displayWord = [
    word.slice(0, foundIndex),
    <span className="bg-green-100">{word.substr(foundIndex, nCharsMatched)}</span>,
    word.slice(foundIndex + nCharsMatched),
  ];

  const replacement = dstMatrices.reduce<ReplacementState>(({ wordIndex, data }, dstMatrix, i) => {
    const srcMatrix = srcMatrices[i];
    // if we matched a "null" in the word,
    // we simply move on to the next destination matrix
    // while looking at the same index in the original word
    const newWordIndex = (srcMatrix === 'null' || srcMatrix === 'boundary') ? wordIndex : wordIndex + 1;

    // if a symbol in the word gets converted to null,
    // we increment the cursor in the original word but don't add anything to the output
    if (dstMatrix === 'null' || dstMatrix === 'boundary') return { wordIndex: newWordIndex, data };

    const featuresToFind = (srcMatrix === 'null' || srcMatrix === 'boundary')
      ? dstMatrix
      : {
        ...wordMatrices[wordIndex],
        ...dstMatrix as Partial<Features>,
      };
    const matchingSounds = filterSounds(allSounds, featuresToFind);
    if (matchingSounds.length > 0) {
      return {
        wordIndex: newWordIndex,
        data: [
          ...data,
          matchingSounds.length === 1
            ? matchingSounds[0].symbol
            : `{${matchingSounds.map((sound) => sound.symbol).join(',')}}`,
        ],
      };
    }

    // if we don't find any matching sounds, find the next top three most
    // similar ones
    const suggestions = sortSoundsBySimilarityTo(allSounds, featuresToFind)
      .filter((sound) => sound.symbol !== word[foundIndex + i])
      .slice(0, 3)
      .map((sound) => sound.symbol);

    return {
      wordIndex: newWordIndex,
      data: [
        ...data,
        <span
          title={`matching sound not found; closest: ${suggestions.join(', ')}`}
          className="bg-red-300"
        >
          ?
        </span>,
      ],
    };
  }, {
    wordIndex: foundIndex,
    data: [],
  });

  const newStr = [
    word.slice(0, foundIndex),
    <span className="bg-green-100">{replacement.data}</span>,
    word.slice(foundIndex + nCharsMatched),
  ];

  return (
    <li key={word}>
      {displayWord}
      <FaLongArrowAltRight className="inline-block mx-2" />
      {newStr}
    </li>
  );
};

export default function PreviewEvolution({ words, src, dst }: {
  words: string[];
  src: Matrix[];
  dst: Matrix[];
}) {
  return (
    <ul>
      {words.map((word) => transformWord(word, src, dst))}
    </ul>
  );
}
