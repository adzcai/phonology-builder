// import phonemes from './phonemes.json';
import rawFeatures from './rawFeatures.tsv';

// the two features missing from the original book are
// implosive and ATR (equivalent to tense in some languages)
export const allFeatures = rawFeatures;

// jeqqa
// xela

export const manners = [
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
    },
  },
  {
    name: 'lateral fricative',
    features: {
      continuant: true,
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
    },
  },
  {
    name: 'lateral approximant',
    features: {
      approximant: true,
      lateral: true,
    },
  },
];

export const places = [
  {
    name: 'bilabial',
    features: {
      labial: true,
      labiodental: false,
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
      anterior: false,
      distributed: true,
    },
  },
  {
    name: 'retroflex',
    features: {
      anterior: false,
      distributed: false,
    },
  },
  {
    name: 'fronted velar',
    features: {
      high: true,
      front: true,
      back: false,
    },
  },
  {
    name: 'velar',
    features: {
      high: true,
      front: 0,
      back: 0,
    },
  },
  {
    name: 'backed velar',
    features: {
      high: true,
      front: false,
      back: true,
    },
  },
  {
    name: 'uvular',
    features: {
      high: false,
      low: false,
    },
  },
  {
    name: 'pharyngeal',
    features: {
      high: false,
      low: true,
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
    name: 'labial-back velar',
    features: {
      labial: true,
      back: true,
    },
  },
  {
    name: 'labial-velar',
    features: {
      labial: true,
      round: false,
    },
  },
  {
    name: 'labial-front velar',
    features: {
      labial: true,
      front: true,
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
      anterior: false,
      distributed: true,
      high: true,
    },
  },
];

export function matchFeatures(...featureObjs) {
  const merged = Object.assign({}, ...featureObjs);
  return allFeatures.filter((feature) =>
    Object.keys(merged).every((key) => feature[key] === merged[key]),
  );
}
