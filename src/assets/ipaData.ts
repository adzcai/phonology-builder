import { createContext, Dispatch, SetStateAction } from 'react';
import { diacritics as rawDiacritics, manners as rawManners, places as rawPlaces } from './featureData.json';
import rawSoundsTsv from './rawFeatures.tsv';

export type Condition = Partial<Sound> | ((_: Sound) => boolean) | Condition[];

export type FeatureSet = {
  name: string;
  features: Condition;
};

export type Manner = FeatureSet;
export type Place = FeatureSet;
export type Diacritic = FeatureSet & {
  displayName: string;
  requirements: Partial<Sound>;
  createNewRow: boolean;
};
export type Frontness = FeatureSet;
export type Height = FeatureSet;

export type SoundHook = Dispatch<SetStateAction<Sound[]>>;

export type Sound = {
  name: string;
  syllabic: boolean | 0;
  stress: boolean | 0;
  long: boolean | 0;
  consonantal: boolean | 0;
  sonorant: boolean | 0;
  continuant: boolean | 0;
  'delayed release': boolean | 0;
  approximant: boolean | 0;
  tap: boolean | 0;
  trill: boolean | 0;
  nasal: boolean | 0;
  voice: boolean | 0;
  'spread gl': boolean | 0;
  'constr gl': boolean | 0;
  labial: boolean | 0;
  round: boolean | 0;
  labiodental: boolean | 0;
  coronal: boolean | 0;
  anterior: boolean | 0;
  distributed: boolean | 0;
  strident: boolean | 0;
  lateral: boolean | 0;
  dorsal: boolean | 0;
  high: boolean | 0;
  low: boolean | 0;
  front: boolean | 0;
  back: boolean | 0;
  tense: boolean | 0;
};

// the two features missing from the original book are
// implosive and ATR (equivalent to tense in some languages)
export const rawSounds = rawSoundsTsv as Sound[];
export const allManners = rawManners as Manner[];
export const allPlaces = rawPlaces as Place[];

function matchCondition(sound, condition: Condition) {
  if (Array.isArray(condition)) return condition.every((c) => matchCondition(sound, c));

  if (typeof condition === 'object') {
    // check for array
    return Object.keys(condition)
      .filter((key) => key !== 'name')
      .every((key) => (Array.isArray(condition[key])
        ? condition[key].includes(sound[key])
        : sound[key] === condition[key]));
  }

  if (typeof condition === 'function') return condition(sound);

  return true;
}

export function matchFeatures(sounds: Sound[], ...conditions: Condition[]) {
  return sounds.filter(
    (sound) => conditions.every((condition) => matchCondition(sound, condition)),
  );
}

const featureInverseMap = new Map<boolean | 0, [boolean | 0, boolean | 0]>([
  [0, [true, false]],
  [true, [false, 0]],
  [false, [0, true]],
]);

export function invertFeatures(features: Partial<Sound>) {
  return Object.keys(features).reduce(
    (prev, key) => ({
      ...prev,
      [key]: featureInverseMap.get(features[key]),
    }),
    {},
  );
}

export type TableContextType = {
  allSounds: Sound[];
  setAllSounds: SoundHook;
  selectedSounds: Sound[];
  setSelectedSounds: SoundHook;
  neighbor: Sound | null;
  setNeighbor: Dispatch<SetStateAction<Sound | null>>;
  selectedDiacritics: Diacritic[] | null;
  setSelectedDiacritics: Dispatch<SetStateAction<Diacritic[]>>;
  handleDiacriticClick: (diacritic: Diacritic) => void;
  deleteFeatureSet: (featureSet: FeatureSet) => void;
};

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

type FilterContextType = {
  selectedSounds: Sound[];
  selectedDiacritics: Diacritic[];
};

export const FilterContext = createContext<FilterContextType>({
  selectedSounds: [],
  selectedDiacritics: [],
});

export const allFeatures = [
  ['name', 'name', 'name'],

  ['syllabic', 'sonority', 'manner'],
  ['consonantal', 'sonority', 'manner'],
  ['approximant', 'sonority', 'manner'],
  ['sonorant', 'sonority', 'manner'],
  ['continuant', 'obstruents', 'manner'],
  ['delayed release', 'obstruents', 'manner'],
  ['nasal', 'nasal', 'manner'],

  ['tap', 'trills and taps', 'manner'],
  ['trill', 'trills and taps', 'manner'],

  ['voice', 'laryngeal', 'laryngeal'],
  ['spread gl', 'laryngeal', 'laryngeal'],
  ['constr gl', 'laryngeal', 'laryngeal'],

  ['labial', 'labial', 'place'],
  ['round', 'labial', 'place'],
  ['labiodental', 'labial', 'place'],

  ['coronal', 'coronal', 'place'],
  ['anterior', 'coronal', 'place'],
  ['distributed', 'coronal', 'place'],
  ['strident', 'coronal', 'place'],
  ['lateral', 'coronal', 'place'],

  ['dorsal', 'dorsal', 'place'],
  ['high', 'dorsal', 'place'],
  ['low', 'dorsal', 'place'],
  ['front', 'dorsal', 'place'],
  ['back', 'dorsal', 'place'],
  ['tense', 'dorsal', 'place'],

  ['stress', 'prosody', 'prosody'],
  ['long', 'prosody', 'prosody'],
];

export const allDiacritics: Diacritic[] = rawDiacritics;

/* eslint-disable object-curly-newline */
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
/* eslint-enable object-curly-newline */

// arr is a list of all e.g. places, manners, heights, frontnesses
// get all elements of arr which contain sounds
export function filterNonEmpty(sounds: Sound[], arr: FeatureSet[], ...conditions: Condition[]) {
  return arr.filter(
    ({ features }) => matchFeatures(sounds, features, ...conditions).length,
  );
}

export function toggleInArray<T>(array: T[], element: T) {
  return array.includes(element) ? array.filter((e) => e !== element) : [...array, element];
}

export function canApplyDiacriticsToSound(diacritics: Diacritic[], sound: Sound) {
  // can't apply diacritics if they have no effect
  return diacritics.every((diacritic) => matchFeatures([sound], diacritic.requirements).length > 0
          && matchFeatures([sound], diacritic.features).length === 0);
}

export function applyDiacriticsToSound(sound: Sound, ...diacritics: Diacritic[]) {
  const newSound: Sound = { ...sound };
  diacritics.forEach((diacritic) => {
    newSound.name += diacritic.name;
    Object.keys(diacritic.features).forEach((feature) => {
      newSound[feature] = diacritic.features[feature];
    });
  });
  return newSound;
}
