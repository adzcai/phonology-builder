import { createContext } from 'react';
import featureData from './feature-data.json';
import rawSounds from './base-features.json';
import rawDiacritics from './diacritics.json';
import {
  Manner, Place, Condition, Diacritic, FeatureFilter, Features, Height, Sound, TableContextType,
  HeightsContextType,
} from '../lib/types';

// the two features missing from the original book are
// implosive and ATR (equivalent to tense in some languages)
export const allSounds = rawSounds.map(({ symbol, ...features }) => ({
  symbol,
  features,
})) as Sound[];
export const allManners = featureData.manners as Manner[];
export const allPlaces = featureData.places as Place[];

function matchConditions(sound: Features, condition: Condition, strict: boolean = true) {
  if (Array.isArray(condition)) return condition.every((c) => matchConditions(sound, c));

  if (typeof condition === 'object') {
    // check for array
    return Object.keys(condition)
      .every((key) => (Array.isArray(condition[key])
        ? condition[key].includes(sound[key])
        : sound[key] === condition[key]
          || (!strict && (sound[key] === 0 || condition[key] === 0))));
  }

  if (typeof condition === 'function') return condition(sound);

  return true;
}

export function matchFeatures(featuresArr: Features[], ...conditions: Condition[]) {
  return featuresArr.filter(
    (features) => matchConditions(features, conditions),
  );
}

export function matchSounds(sounds: Sound[], ...conditions: Condition[]) {
  return sounds.filter((sound) => matchConditions(sound.features, conditions));
}

const featureInverseMap = new Map<boolean | 0, [boolean | 0, boolean | 0]>([
  [0, [true, false]],
  [true, [false, 0]],
  [false, [0, true]],
]);

export function invertFeatures(features: Partial<Features>) {
  return Object.keys(features).reduce(
    (prev, key) => ({
      ...prev,
      [key]: featureInverseMap.get(features[key]),
    }),
    {},
  );
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
  handleDiacriticClick: () => {},
  deleteFeatureSet: () => {},
});

export const HeightsContext = createContext<HeightsContextType>({
  allHeights: [],
  setAllHeights: () => {},
});

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

// arr is a list of all e.g. places, manners, heights, frontnesses
// get all elements of arr which contain sounds
export function filterNonEmptyFeatureSets(
  sounds: Sound[], arr: FeatureFilter[], ...conditions: Condition[]
) {
  const soundFeatures = sounds.map((sound) => sound.features);
  return arr.filter(
    ({ features }) => matchFeatures(soundFeatures, features, ...conditions).length > 0,
  );
}

export function toggleInArray<T>(array: T[], element: T) {
  return array.includes(element) ? array.filter((e) => e !== element) : [...array, element];
}

export function canApplyDiacriticsToSound(diacritics: Diacritic[], sound: Features) {
  // can't apply diacritics if they have no effect
  return diacritics.every((diacritic) => matchFeatures([sound], diacritic.requirements).length > 0
          && matchFeatures([sound], diacritic.features).length === 0);
}

export function applyDiacriticsToSound(sound: Sound, ...diacritics: Diacritic[]) {
  const newSound: Sound = {
    symbol: sound.symbol,
    features: { ...sound.features },
  }; // copy the current sound
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

export function cloneSound(sound: Sound) {
  return { symbol: sound.symbol, features: { ...sound.features } };
}
