import React from 'react';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { allSounds } from '../../assets/ipa-data';
import { Features, Matrix } from '../../lib/types';
import {
  featureListToFeatures, findIndexOfMatrices, filterSounds, sortSoundsBySimilarityTo,
} from '../../lib/util';

export default function PreviewEvolution({ words, src, dst }: {
  words: string[];
  src: Matrix[];
  dst: Matrix[];
}) {
  return (
    <ul>
      {words.map((word) => {
        // turn word into a list of feature matrices
        const wordMatrices = word.split('').map((char) => allSounds.find((segment) => segment.symbol === char).features);
        const matrices = src.map((matrix) => (typeof matrix.data === 'string' ? matrix.data : featureListToFeatures(matrix.data)));
        const dstMatrices = dst.map((matrix) => (typeof matrix.data === 'string' ? matrix.data : featureListToFeatures(matrix.data)));
        const foundIndex = findIndexOfMatrices(wordMatrices, matrices);

        if (foundIndex < 0) {
          return (
            <li key={word}>
              {word}
              {' '}
              not found
            </li>
          );
        }

        const displayWord = [
          word.slice(0, foundIndex),
          <span className="bg-green-100">{word.substr(foundIndex, matrices.length)}</span>,
          word.slice(foundIndex + matrices.length),
        ];

        const replacement = wordMatrices
          .slice(foundIndex, foundIndex + matrices.length)
          .map((features, i) => {
            // skip anything that's not actually a feature matrix
            if (dstMatrices[i] === 'null' || dstMatrices[i] === 'boundary') return null;

            const featuresToFind = {
              ...features,
              ...dstMatrices[i] as Partial<Features>,
            };
            const matchingSounds = filterSounds(allSounds, featuresToFind);
            if (matchingSounds.length === 0) {
              const suggestions = sortSoundsBySimilarityTo(allSounds, featuresToFind)
                .filter((sound) => sound.symbol !== word[foundIndex + i])
                .slice(0, 3)
                .map((sound) => sound.symbol);
              return (
                <span
                  title={`matching sound not found; closest: ${suggestions.join(', ')}`}
                  className="bg-red-300"
                >
                  ?
                </span>
              );
            }
            return matchingSounds[0].symbol;
          });

        const newStr = [
          word.slice(0, foundIndex),
          <span className="bg-green-100">{replacement}</span>,
          word.slice(foundIndex + matrices.length),
        ];

        return (
          <li key={word}>
            {displayWord}
            <FaLongArrowAltRight className="inline-block mx-2" />
            {newStr}
          </li>
        );
      })}
    </ul>
  );
}
