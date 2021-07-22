import React, { ReactNode } from 'react';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { allDiacritics, allSounds } from '../../assets/ipa-data';
import {
  Features, Matrix, SerializedFeatureList,
} from '../../lib/client/types';
import {
  featureListToFeatures, findIndexOfMatrices, filterSounds, sortSoundsBySimilarityTo,
  canApplyDiacriticsToFeatures,
  replaceConfusables,
} from '../../lib/client/util';

type FeaturesOrZero = Partial<Features> | 'null';

type ReplaceMatricesArgs = {
  wordMatrices: Features[];
  srcMatrices: FeaturesOrZero[];
  dstMatrices: FeaturesOrZero[];
  foundIndex: number;
};

type SuccessfulReplace = string;

type FailedReplace = {
  partial: string;
  index: number;
  features: Partial<Features>;
};

function replaceMatrices({
  wordMatrices, srcMatrices, dstMatrices, foundIndex,
}: ReplaceMatricesArgs): SuccessfulReplace | FailedReplace {
  let wordIndex = foundIndex;
  let data = '';

  for (let i = 0; i < dstMatrices.length; ++i) {
    const srcMatrix = srcMatrices[i];
    const dstMatrix = dstMatrices[i];

    if (dstMatrix === 'null') {
      if (srcMatrix !== 'null') ++wordIndex;
      continue;
    }

    // if the source matrix is null, we simply look for sounds that match the
    // given destination features
    // otherwise we add the destination features on top of the existing sound
    const featuresToFind = srcMatrix === 'null'
      ? { ...dstMatrix }
      : { ...wordMatrices[wordIndex], ...dstMatrix };

    const matchingSounds = filterSounds(allSounds, featuresToFind);
    if (matchingSounds.length > 0) {
      // if we matched a "null" in the word,
      // we simply move on to the next destination matrix
      // while looking at the same index in the original word
      if (srcMatrix !== 'null') ++wordIndex;
      if (matchingSounds.length === 1) data += matchingSounds[0].symbol;
      else data += `{${matchingSounds.map((sound) => sound.symbol).join(',')}}`;
    } else {
      return {
        partial: data,
        index: wordIndex,
        features: featuresToFind,
      };
    }
  }

  return data;
}

function stringToFeatures(word: string): Features[] {
  return replaceConfusables(word).split('')
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
}

function extractMatrix(matrix: Matrix) {
  if (typeof matrix.data === 'string') return matrix.data;
  return featureListToFeatures(matrix.data as SerializedFeatureList);
}

const transformWord = (
  word: string, src: Matrix[], dst: Matrix[], preceding: Matrix[], following: Matrix[],
) => {
  // turn word into a list of feature matrices
  const wordMatrices = stringToFeatures(word);
  const srcMatrices = src.map(extractMatrix) as FeaturesOrZero[];
  const srcMatricesWithoutNulls = srcMatrices.filter((data) => data !== 'null') as Partial<Features>[];
  const dstMatrices = dst.map(extractMatrix) as FeaturesOrZero[];
  const precedingMatrices = preceding.map(extractMatrix);
  const followingMatrices = following.map(extractMatrix);
  const options = { startIndex: 0, start: false, end: false };
  if (precedingMatrices[0] === 'boundary') {
    options.start = true;
    precedingMatrices.shift();
  }
  if (followingMatrices[followingMatrices.length - 1] === 'boundary') {
    options.end = true;
    followingMatrices.pop();
  }
  const searchMatrices = [
    ...precedingMatrices, ...srcMatricesWithoutNulls, ...followingMatrices,
  ] as Partial<Features>[];
  let foundIndex = findIndexOfMatrices(wordMatrices, searchMatrices, options);

  if (foundIndex < 0) {
    return { foundIndex, matchWidth: 0, result: null };
  }

  foundIndex += precedingMatrices.length;
  const matchWidth = srcMatricesWithoutNulls.length;
  const result = replaceMatrices({
    wordMatrices, srcMatrices, dstMatrices, foundIndex,
  });

  return { foundIndex, matchWidth, result };
};

type Props = {
  words: string[];
  src: Matrix[];
  dst: Matrix[];
  preceding: Matrix[];
  following: Matrix[];
};

export default function PreviewEvolution({
  words, src, dst, preceding, following,
}: Props) {
  return (
    <ul>
      {words.map((word) => {
        const { foundIndex, matchWidth, result } = transformWord(
          word, src, dst, preceding, following,
        );

        if (foundIndex < 0) {
          return (
            <li key={word}>
              {word}
              {' '}
              not changed
            </li>
          );
        }

        return (
          <li key={word}>
            {word.slice(0, foundIndex)}
            <span className="bg-green-200">{word.substr(foundIndex, matchWidth)}</span>
            {word.slice(foundIndex + matchWidth)}
            <FaLongArrowAltRight className="inline-block mx-2" />
            {word.slice(0, foundIndex)}
            {typeof result === 'string'
              ? <span className="bg-green-200">{result}</span>
              : (
                <>
                  <span className="bg-green-200">
                    {result.partial}
                  </span>
                  <span
                    title={`matching sound for ${word[result.index]} not found; closest: ${sortSoundsBySimilarityTo(allSounds, result.features)
                      .filter((sound) => sound.symbol !== word[result.index])
                      .slice(0, 3)
                      .map((sound) => sound.symbol)
                      .join(', ')}`}
                    className="bg-red-300"
                  >
                    ?
                  </span>
                  <span className="bg-pink-300" title="not checked">{'?'.repeat(foundIndex + matchWidth - result.index - 1)}</span>
                </>
              )}
            {word.slice(foundIndex + matchWidth)}
          </li>
        );
      })}
    </ul>
  );
}
