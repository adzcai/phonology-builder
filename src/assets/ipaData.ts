import { createContext, Dispatch, SetStateAction } from 'react';
import rawSounds from './rawFeatures.tsv';

// const exceptions = ['ɫ']

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
export const allSounds: Sound[] = rawSounds;

// jeqqa
// xela

export type Manner = {
  name: string;
  features: Partial<Sound>;
};

export const manners: Manner[] = [
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

export type Place = {
  name: string;
  features: Partial<Sound>;
};

export const places: Place[] = [
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
    name: 'palatoalveolar',
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
    Object.keys(merged).every((key) => feature[key] === merged[key]),
  );
}

export type SoundHook = Dispatch<SetStateAction<Sound[]>>;

export const SoundContext = createContext<{
  sounds: Sound[];
  setSounds: SoundHook;
}>({
  sounds: [],
  setSounds: () => {},
});
