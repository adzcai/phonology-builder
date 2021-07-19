import { createContext } from 'react';
import featureData from './feature-data.json';
import rawSounds from './base-features.json';
import rawDiacritics from './diacritics.json';
import {
  Manner, Place, Condition, Diacritic, FeatureFilter, Features, Height, Sound, TableContextType,
  HeightsContextType,
  SerializedFeatureList,
} from '../lib/types';

// the two features missing from the original book are
// implosive and ATR (equivalent to tense in some languages)
export const allSounds = rawSounds.map(({ symbol, ...features }) => ({
  symbol,
  features,
})) as Sound[];
export const allManners = featureData.manners as Manner[];
export const allPlaces = featureData.places as Place[];

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
 * Filter an array of sounds by a set of conditions.
 * @param sounds the list of sounds to filter through
 * @param conditions the list of conditions to filter by
 * @returns the sounds which match the given conditions
 */
export function filterSounds(sounds: Sound[], ...conditions: Condition[]) {
  return sounds.filter((sound) => matchConditions(sound.features, conditions));
}

// Descriptions of the supported features in the form [name, category, description].
export const allFeatures: [keyof Features, string, string][] = [
  ['syllabic', 'manner', 'can occur as syllable nucleus; typically [+syllabic] consists of vowels'],
  ['consonantal', 'manner', 'see sonority hierarchy'],
  ['approximant', 'manner', 'see sonority hierarchy'],
  ['sonorant', 'manner', 'see sonority hierarchy'],
  ['continuant', 'manner', 'see sonority hierarchy; [-continuant] full closure of oral cavity'],
  ['delayed release', 'manner', 'see sonority hierarchy; includes frication (hissing) noise'],
  ['nasal', 'manner', 'air escapes through the nose'],
  ['tap', 'manner', 'motion where one articulator is thrown against another'],
  ['trill', 'manner', 'vibration between the active and passive articulator'],

  ['voice', 'laryngeal', 'vocal chord vibration'],
  ['spread gl', 'laryngeal', 'vocal chords far apart, producing wide glottis'],
  ['constr gl', 'laryngeal', 'vocal chords close together, producing narrow or closed glottis'],

  ['labial', 'place', 'articulated with the lips'],
  ['round', 'place', 'rounded lips'],
  ['labiodental', 'place', 'touching lower lip to upper teeth'],

  ['coronal', 'place', 'articulated with the tip/blade of the tongue'],
  ['anterior', 'place', 'at the alveolar ridge or forward'],
  ['distributed', 'place', 'laminals (tongue blade) are [+distributed], apicals (tongue tip) are [-distributed]'],
  ['strident', 'place', 'airstream channelled through groove and blown at the teeth; [+strident] aka sibilant'],
  ['lateral', 'place', 'tongue compressed horizontally to allow airflow through sides'],
  ['dorsal', 'place', 'articulated with the body of the tongue'],

  ['high', 'dorsal', 'tongue body high in the mouth'],
  ['low', 'dorsal', 'tongue body low in the mouth'],
  ['front', 'dorsal', 'tongue body in the front of the mouth'],
  ['back', 'dorsal', 'tongue body in back of the mouth'],
  ['tense', 'dorsal', 'finer distinction of height; [-tense] aka lax'],

  ['stress', 'prosody', 'emphasized sound'],
  ['long', 'prosody', 'increased duration of vowel or consonant'],
];

// All builtin diacritics
export const allDiacritics: Diacritic[] = rawDiacritics;

export const allFrontnesses = [
  { name: 'front unrounded', features: { round: false, front: true, back: false } },
  { name: 'front rounded', features: { round: true, front: true, back: false } },
  { name: 'central unrounded', features: { round: false, front: false, back: false } },
  { name: 'central rounded', features: { round: true, front: false, back: false } },
  { name: 'back unrounded', features: { round: false, front: false, back: true } },
  { name: 'back rounded', features: { round: true, front: false, back: true } },
];

export const allHeights: Height[] = [
  { name: 'close', features: { high: true, low: false, tense: true } },
  { name: 'near-close', features: { high: true, low: false, tense: false } },
  { name: 'mid', features: { high: false, low: false, tense: true } },
  { name: 'near-open', features: { high: false, low: false, tense: false } },
  { name: 'open', features: { high: false, low: true } },
];

/**
 * Get all feature filters (e.g. heights, manners, places) which contain some of
 * the given sounds.
 * @param sounds the set of sounds to use
 * @param arr the list of feature filters to filter through
 * @param conditions the set of conditions to filter by
 * @returns all elements of arr which match some of the given sounds
 */
export function filterNonEmptyFeatureSets(
  sounds: Sound[], arr: FeatureFilter[], ...conditions: Condition[]
) {
  const soundFeatures = sounds.map((sound) => sound.features);
  return arr.filter(
    ({ features }) => filterFeatures(soundFeatures, features, ...conditions).length > 0,
  );
}

export function toggleInArray<T>(array: T[], element: T) {
  return array.includes(element) ? array.filter((e) => e !== element) : [...array, element];
}

/**
 * Check if a set of diacritics can all be applied to a given sound.
 * @param diacritics the set of diacritics whose validity to check
 * @param sound the sound we are trying to apply to the diacritics to
 * @returns true if the given diacritics can all be applied to the given sound
 */
export function canApplyDiacriticsToSound(diacritics: Diacritic[], sound: Features) {
  // can't apply diacritics if they have no effect
  return diacritics.every((diacritic) => filterFeatures([sound], diacritic.requirements).length > 0
          && filterFeatures([sound], diacritic.features).length === 0);
}

export function cloneSound(sound: Sound) {
  return { symbol: sound.symbol, features: { ...sound.features } };
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

export const TableContext = createContext<TableContextType>({
  allSounds: [],
  setAllSounds: () => {},
  selectedSounds: [],
  setSelectedSounds: () => {},
  neighbor: null,
  setNeighbor: () => {},
  selectedDiacritics: null,
  setSelectedDiacritics: () => {},
  selectedChart: null,
  setSelectedChart: () => {},
  handleDiacriticClick: () => {},
  deleteFeatureSet: () => {},
});

export const HeightsContext = createContext<HeightsContextType>({
  allHeights: [],
  setAllHeights: () => {},
});
