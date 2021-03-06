import { Dispatch, SetStateAction } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { allFeatures } from '../../assets/ipa-data';
import {
  Features,
  Condition,
  Phoneme,
  FeatureFilter,
  Diacritic,
  Matrix,
  Rule,
} from './types';

// ==================== MISC ====================

// explicitly check if they are two booleans since we don't want a comparison
// with 0 to show up
// eslint-disable-next-line max-len
export function trueDifference(
  a: Partial<Features>,
  b: Partial<Features>,
  feature: keyof Features,
) {
  return (
    (a[feature] === true && b[feature] === false)
    || (a[feature] === false && b[feature] === true)
  );
}

export function countDistinctFeatures(
  a: Partial<Features>,
  b: Partial<Features>,
) {
  return allFeatures.filter(([feature]) => trueDifference(a, b, feature))
    .length;
}

export function cloneSound(sound: Phoneme) {
  return { symbol: sound.symbol, features: { ...sound.features } };
}

export function toggleInArray<T>(array: T[], element: T) {
  return array.includes(element)
    ? array.filter((e) => e !== element)
    : [...array, element];
}

export function createMatrix(): Matrix {
  return {
    data: [['', null]],
    id: uuidv4(),
  };
}

export function createRule(): Rule {
  return {
    src: [],
    dst: [],
    preceding: [],
    following: [],
    id: uuidv4(),
  };
}

export function replaceConfusables(word: string) {
  return word.replaceAll('g', '\u0261');
}

export function insertAt<T>(
  setter: Dispatch<SetStateAction<T[]>>,
  idx: number,
  obj: T,
) {
  setter((prev) => [...prev.slice(0, idx), obj, ...prev.slice(idx)]);
}

// ==================== FILTER AND MATCH ====================

/**
 * Check if a segment matches a given condition or set of conditions.
 * @param segment the set of features to check
 * @param condition the condition to check it by
 * @param strict set to false to consider 0 as equal to + or -
 * @returns true if the segment matches the condition
 */
export function matchConditions(
  segment: Features,
  condition: Condition,
  strict: boolean = true,
) {
  if (Array.isArray(condition)) return condition.every((c) => matchConditions(segment, c));

  // if the condition is a feature
  if (typeof condition === 'object') {
    return Object.keys(condition).every(
      (key) => segment[key] === condition[key]
        || (!strict && (segment[key] === 0 || condition[key] === 0)),
    );
  }

  if (typeof condition === 'function') return condition(segment);

  return true;
}

/**
 * Filter an array of segments by a set of conditions.
 * @param featuresArr the list of segments to filter through
 * @param conditions the set of conditions to filter by
 * @returns the segments which match the given conditions
 */
export function filterFeatures(
  featuresArr: Features[],
  ...conditions: Condition[]
) {
  return featuresArr.filter((features) => matchConditions(features, conditions));
}

/**
 * Filter an array of sounds by a set of conditions using {@link filterFeatures}.
 * @param sounds the list of sounds to filter through
 * @param conditions the list of conditions to filter by
 * @returns the sounds which match the given conditions
 */
export function filterSounds(sounds: Phoneme[], ...conditions: Condition[]) {
  return sounds.filter((sound) => matchConditions(sound.features, conditions));
}

/**
 * Get all feature filters (e.g. heights, manners, places) which contain some of
 * the given sounds.
 * @param arr the list of feature filters to filter through
 * @param sounds the set of sounds to use
 * @param conditions the set of conditions to filter by
 * @returns all elements of arr which match some of the given sounds
 */
export function filterNonEmptyFeatureSets(
  arr: FeatureFilter[],
  sounds: Phoneme[],
  ...conditions: Condition[]
) {
  const soundFeatures = sounds.map((sound) => sound.features);
  return arr.filter(
    ({ features }) => filterFeatures(soundFeatures, features, ...conditions).length > 0,
  );
}

/**
 * Check if a set of diacritics can all be applied to a given sound.
 * @param diacritics the set of diacritics whose validity to check
 * @param sound the sound we are trying to apply to the diacritics to
 * @returns true if the given diacritics can all be applied to the given sound
 */
export function canApplyDiacriticsToFeatures(
  diacritics: Diacritic[],
  sound: Features,
) {
  // can't apply diacritics if they have no effect
  return diacritics.every(
    (diacritic) => filterFeatures([sound], diacritic.requirements).length > 0
      && filterFeatures([sound], diacritic.features).length === 0,
  );
}

/**
 * Apply diacritics to a sound.
 * @param sound the sound to apply the diacritics to (not modified)
 * @param diacritics the diacritics to apply
 * @returns the resulting sound when the given diacritics are applied to the given sound
 */
export function applyDiacriticsToSound(
  sound: Phoneme,
  ...diacritics: Diacritic[]
) {
  // copy the current sound
  const newSound: Phoneme = cloneSound(sound);

  diacritics.forEach((diacritic) => {
    newSound.symbol += diacritic.symbol; // TODO assumes the diacritic comes after
    Object.assign(newSound.features, diacritic.features);
  });
  return newSound;
}

export function sortSoundsBySimilarityTo(
  sounds: Phoneme[],
  features: Partial<Features>,
) {
  return sounds.slice().sort(
    // eslint-disable-next-line max-len
    (a, b) => countDistinctFeatures(a.features, features)
      - countDistinctFeatures(b.features, features),
  );
}

// eslint-disable-next-line max-len
const matchAll = (features: Features[], conditions: Condition[]) => conditions.length <= features.length
  && conditions.every((condition, i) => matchConditions(features[i], condition));

export function findIndexOfMatrices(
  haystack: Features[],
  needle: Partial<Features>[],
  { startIndex, start, end } = { startIndex: 0, start: false, end: false },
) {
  if (start && end) {
    return haystack.length === needle.length && matchAll(haystack, needle)
      ? 0
      : -1;
  }
  if (start) return matchAll(haystack, needle) ? 0 : -1;
  if (end) {
    return matchAll(haystack.slice().reverse(), needle.slice().reverse())
      ? haystack.length - needle.length
      : -1;
  }
  for (let i = startIndex; i + needle.length <= haystack.length; ++i) {
    if (matchAll(haystack.slice(i), needle)) return i;
  }
  return -1;
}
