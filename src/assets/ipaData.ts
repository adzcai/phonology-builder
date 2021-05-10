import { createContext, Dispatch, SetStateAction } from 'react';
import rawSoundsTsv from './rawFeatures.tsv';

export type FeatureSet = {
  name: string;
  features: Partial<Sound>;
};

export type Manner = FeatureSet;
export type Place = FeatureSet;
export type Diacritic = FeatureSet & {
  displayName: string;
  requirements: Partial<Sound>;
};
export type Frontness = {
  name: string;
  round: boolean;
  front: boolean;
  back: boolean;
};
export type Height = {
  name: string;
  high: boolean;
  low: boolean;
  tense?: boolean;
};

export type SoundHook = Dispatch<SetStateAction<Sound[]>>;

export type TableContextType = {
  allSounds: Sound[];
  setAllSounds: SoundHook;
  sounds: Sound[];
  setSounds: SoundHook;
  neighbor: Sound | null;
  setNeighbor: Dispatch<SetStateAction<Sound | null>>;
  diacritic: Diacritic | null;
  setDiacritic: Dispatch<SetStateAction<Diacritic | null>>;
};

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
export const rawSounds: Sound[] = rawSoundsTsv;

// jeqqa
// xela

export const allManners: Manner[] = [
  {
    name: 'plosive',
    features: {
      'delayed release': false,
    },
  },
  {
    name: 'affricate',
    features: {
      'delayed release': true,
      continuant: false,
      lateral: false,
    },
  },
  {
    name: 'lateral affricate',
    features: {
      'delayed release': true,
      continuant: false,
      lateral: true,
    },
  },
  {
    name: 'fricative',
    features: {
      continuant: true,
      sonorant: false,
      lateral: false,
    },
  },
  {
    name: 'lateral fricative',
    features: {
      continuant: true,
      sonorant: false,
      lateral: true,
    },
  },
  {
    name: 'nasal',
    features: {
      nasal: true,
    },
  },
  {
    name: 'trill',
    features: {
      trill: true,
    },
  },
  {
    name: 'tap/flap',
    features: {
      tap: true,
      lateral: false,
    },
  },
  {
    name: 'lateral flap',
    features: {
      tap: true,
      lateral: true,
    },
  },
  {
    name: 'approximant',
    features: {
      approximant: true,
      trill: false,
      tap: false,
      lateral: false,
    },
  },
  {
    name: 'lateral approximant',
    features: {
      approximant: true,
      lateral: true,
      tap: false,
    },
  },
];

export const allPlaces: Place[] = [
  {
    name: 'bilabial',
    features: {
      labial: true,
      labiodental: false,
      dorsal: false,
      coronal: false,
    },
  },
  {
    name: 'labiodental',
    features: {
      labiodental: true,
    },
  },
  {
    name: 'dental',
    features: {
      anterior: true,
      distributed: true,
      strident: false,
    },
  },
  {
    name: 'alveolar',
    features: {
      anterior: true,
      distributed: false,
    },
  },
  {
    name: 'palato-alveolar',
    features: {
      coronal: true,
      anterior: false,
      distributed: true,
      dorsal: false,
    },
  },
  {
    name: 'retroflex',
    features: {
      coronal: true,
      anterior: false,
      distributed: false,
    },
  },
  {
    name: 'fronted velar',
    features: {
      labial: false,
      coronal: false,
      high: true,
      low: false,
      front: true,
      back: false,
    },
  },
  {
    name: 'velar',
    features: {
      labial: false,
      high: true,
      low: false,
      front: 0, // false
      back: 0, // false
    },
  },
  {
    name: 'back velar',
    features: {
      labial: false,
      high: true,
      low: false,
      front: false,
      back: true,
    },
  },
  {
    name: 'uvular',
    features: {
      coronal: false,
      high: false,
      low: false,
      front: false,
      back: true,
    },
  },
  {
    name: 'pharyngeal',
    features: {
      high: false,
      low: true,
      front: false,
      back: true,
    },
  },
  {
    name: 'glottal',
    features: {
      labial: false,
      coronal: false,
      dorsal: false,
    },
  },
  {
    name: 'labial-front velar',
    features: {
      labial: true,
      coronal: false,
      lateral: false,
      dorsal: true,
      high: true,
      low: false,
      front: true,
      back: false,
    },
  },
  {
    name: 'labial-velar',
    features: {
      labial: true,
      high: true,
      low: false,
      front: 0, // false
      back: 0, // false
    },
  },
  {
    name: 'labial-back velar',
    features: {
      labial: true,
      high: true,
      low: false,
      front: false,
      back: true,
    },
  },
  {
    name: 'alveolo-palatal',
    features: {
      anterior: true,
      distributed: true,
      strident: true,
      high: true,
      front: true,
    },
  },
  {
    name: 'palatal',
    features: {
      coronal: true,
      anterior: false,
      distributed: true,
      dorsal: true,
      high: true,
      low: false,
      front: true,
      back: false,
    },
  },
];

export function matchFeatures(
  sounds: Sound[],
  ...featureObjs: Partial<Sound>[]
) {
  const merged = Object.assign({}, ...featureObjs);
  return sounds.filter((feature) =>
    Object.keys(merged).every(
      (key) => key === 'name' || feature[key] === merged[key],
    ),
  );
}

export const TableContext = createContext<TableContextType>({
  allSounds: [],
  setAllSounds: () => {},
  sounds: [],
  setSounds: () => {},
  neighbor: null,
  setNeighbor: () => {},
  diacritic: null,
  setDiacritic: () => {},
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

export const diacritics: Diacritic[] = [
  {
    displayName: 'syllabic',
    name: '̩',
    features: {
      syllabic: true,
    },
    requirements: {
      consonantal: true,
    },
  },
  {
    displayName: 'creaky voice',
    name: '̰',
    features: {
      'spread gl': false,
      'constr gl': true,
    },
    requirements: {
      voice: true,
    },
  },
  {
    displayName: 'breathy voice',
    name: '̤',
    features: {
      'spread gl': true,
      'constr gl': false,
    },
    requirements: {
      voice: true,
    },
  },
  {
    displayName: 'voiceless',
    name: '̥',
    features: {
      voice: false,
    },
    requirements: {
      voice: true,
    },
  },
  {
    displayName: 'palato-alveolar',
    name: '̠',
    features: {
      anterior: false,
      distributed: true,
    },
    requirements: {
      anterior: true,
      distributed: false,
    },
  },
  {
    displayName: 'dental',
    name: '̪',
    features: {
      anterior: true,
      distributed: true,
    },
    requirements: {
      anterior: true,
      distributed: false,
    },
  },
  {
    displayName: 'fronted velar',
    name: '̟',
    features: {
      front: true,
      back: false,
    },
    requirements: {
      high: true,
      low: false,
    },
  },
  {
    displayName: 'backed velar',
    name: '̠',
    features: {
      front: false,
      back: true,
    },
    requirements: {
      high: true,
      low: false,
    },
  },
  {
    displayName: 'stressed',
    name: 'ˈ',
    features: {
      stress: true,
    },
    requirements: {},
  },
  {
    displayName: 'long',
    name: 'ː',
    features: {
      long: true,
    },
    requirements: {},
  },
  {
    displayName: 'aspirated',
    name: 'ʰ',
    features: {
      'spread gl': true,
      'constr gl': false,
    },
    requirements: {
      consonantal: true,
    },
  },
  {
    displayName: 'palatalized',
    name: 'ʲ',
    features: {
      dorsal: true,
      high: true,
      low: false,
      front: true,
      back: false,
    },
    requirements: {
      consonantal: true,
    },
  },
  {
    displayName: 'labialized',
    name: 'ʷ',
    features: {
      labial: true,
      round: true,
    },
    requirements: {
      consonantal: true,
    },
  },
  {
    displayName: 'velarized',
    name: 'ˠ',
    features: {
      dorsal: true,
      high: true,
      low: false,
      front: false,
      back: true,
    },
    requirements: {
      consonantal: true,
    },
  },
  {
    displayName: 'pharyngealized',
    name: 'ˤ',
    features: {
      dorsal: true,
      high: false,
      low: true,
      front: false,
      back: true,
    },
    requirements: {
      consonantal: true,
    },
  },
  {
    displayName: 'nasalized',
    name: '̃',
    features: {
      nasal: true,
    },
    requirements: {
      sonorant: true,
    },
  },
  {
    displayName: 'rhotic',
    name: '˞',
    features: {
      coronal: true,
      anterior: true,
      distributed: true,
      strident: false,
    },
    requirements: {
      syllabic: true,
    },
  },
  {
    displayName: 'ejective',
    name: 'ʼ',
    features: {
      'spread gl': false,
      'constr gl': true,
    },
    requirements: {
      sonorant: false,
    },
  },
];

/* eslint-disable object-curly-newline */
export const allFrontnesses = [
  { name: 'front unrounded', round: false, front: true, back: false },
  { name: 'front rounded', round: true, front: true, back: false },
  { name: 'central unrounded', round: false, front: false, back: false },
  { name: 'central rounded', round: true, front: false, back: false },
  { name: 'back unrounded', round: false, front: false, back: true },
  { name: 'back rounded', round: true, front: false, back: true },
];

export const allHeights = [
  { name: 'close', high: true, low: false, tense: true },
  { name: 'near-close', high: true, low: false, tense: false },
  { name: 'mid', high: false, low: false, tense: true },
  { name: 'near-open', high: false, low: false, tense: false },
  { name: 'open', high: false, low: true },
];
/* eslint-enable object-curly-newline */
