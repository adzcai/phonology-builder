import { v4 as uuidv4 } from 'uuid';
import { allFeatures } from '../assets/ipa-data';
import {
  Features, Condition, Sound, FeatureFilter, Diacritic, SerializedFeatureList, Matrix, Rule,
} from './types';

// ==================== MISC ====================

// explicitly check if they are two booleans since we don't want a comparison
// with 0 to show up
// eslint-disable-next-line max-len
export function trueDifference(a: Partial<Features>, b: Partial<Features>, feature: keyof Features) {
  return ((a[feature] === true && b[feature] === false)
    || (a[feature] === false && b[feature] === true));
}

export function countDistinctFeatures(a: Partial<Features>, b: Partial<Features>) {
  return allFeatures.filter(([feature]) => trueDifference(a, b, feature)).length;
}

export function cloneSound(sound: Sound) {
  return { symbol: sound.symbol, features: { ...sound.features } };
}

export function toggleInArray<T>(array: T[], element: T) {
  return array.includes(element) ? array.filter((e) => e !== element) : [...array, element];
}

export function createMatrix(): Matrix {
  return {
    data: [['', null]], id: uuidv4(),
  };
}

export function createRule(): Rule {
  return {
    src: [], dst: [], preceding: [], following: [], id: uuidv4(),
  };
}

export function replaceConfusables(word: string) {
  return word.replaceAll('g', '\u0261');
}

// ==================== FILTER AND MATCH ====================

/**
 * Check if a segment matches a given condition or set of conditions.
 * @param segment the set of features to check
 * @param condition the condition to check it by
 * @param strict set to false to consider 0 as equal to + or -
 * @returns true if the segment matches the condition
 */
export function matchConditions(segment: Features, condition: Condition, strict: boolean = true) {
  if (Array.isArray(condition)) return condition.every((c) => matchConditions(segment, c));

  // if the condition is a feature
  if (typeof condition === 'object') {
    return Object.keys(condition)
      .every((key) => (segment[key] === condition[key]
            || (!strict && (segment[key] === 0 || condition[key] === 0))));
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
export function filterFeatures(featuresArr: Features[], ...conditions: Condition[]) {
  return featuresArr.filter(
    (features) => matchConditions(features, conditions),
  );
}

/**
   * Filter an array of sounds by a set of conditions using {@link filterFeatures}.
   * @param sounds the list of sounds to filter through
   * @param conditions the list of conditions to filter by
   * @returns the sounds which match the given conditions
   */
export function filterSounds(sounds: Sound[], ...conditions: Condition[]) {
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
  arr: FeatureFilter[], sounds: Sound[], ...conditions: Condition[]
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
export function canApplyDiacriticsToFeatures(diacritics: Diacritic[], sound: Features) {
  // can't apply diacritics if they have no effect
  return diacritics.every((diacritic) => filterFeatures([sound], diacritic.requirements).length > 0
            && filterFeatures([sound], diacritic.features).length === 0);
}

/**
   * Apply diacritics to a sound.
   * @param sound the sound to apply the diacritics to (not modified)
   * @param diacritics the diacritics to apply
   * @returns the resulting sound when the given diacritics are applied to the given sound
   */
export function applyDiacriticsToSound(sound: Sound, ...diacritics: Diacritic[]) {
  // copy the current sound
  const newSound: Sound = cloneSound(sound);

  diacritics.forEach((diacritic) => {
    newSound.symbol += diacritic.symbol; // TODO assumes the diacritic comes after
    Object.assign(newSound.features, diacritic.features);
  });
  return newSound;
}

export function sortSoundsBySimilarityTo(sounds: Sound[], features: Partial<Features>) {
  return sounds.slice().sort(
    // eslint-disable-next-line max-len
    (a, b) => countDistinctFeatures(a.features, features) - countDistinctFeatures(b.features, features),
  );
}

// eslint-disable-next-line max-len
export function findIndexOfMatrices(str: Features[], matrices: Partial<Features>[], startIndex = 0) {
  const n = matrices.length;
  if (n + startIndex >= str.length) return -1;

  for (let i = startIndex; i + n <= str.length; ++i) {
    let match = true;
    for (let j = 0; j < n; ++j) {
      if (!matchConditions(str[i + j], matrices[j] as Partial<Features>)) {
        match = false;
        break;
      }
    }
    if (match) return i;
  }

  return -1;
}

// ==================== DE/SERIALIZATION ====================

export function serializeFeatureValue(feature) {
  return (feature === 0 ? '0' : (feature ? '+' : '-'));
}

export function deserializeFeatureValue(feature) {
  return ({ 0: 0, '+': true, '-': false }[feature]);
}

export function serializeSound(sound: Sound) {
  return Object.keys(sound).filter((key) => key !== 'symbol').reduce((obj, feature) => ({
    ...obj, [feature]: serializeFeatureValue(obj[feature]),
  }), { symbol: sound.symbol });
}

export function deserializeSound(sound: any) {
  return Object.keys(sound).filter((key) => key !== 'symbol').reduce((obj, feature) => ({
    ...obj, [feature]: deserializeFeatureValue(obj[feature]),
  }), { symbol: sound.symbol });
}

export function featureListToFeatures(featureList: SerializedFeatureList): Partial<Features> {
  return featureList.reduce((obj, [feature, value]) => ({
    ...obj, [feature]: deserializeFeatureValue(value),
  }), {});
}
