import mongoose from 'mongoose';

export type Sound = {
  symbol: string;
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

const FeatureEnum = {
  type: String,
  enum: ['0', '+', '-'],
};

const SoundSchema = new mongoose.Schema<Sound>({
  symbol: String,
  syllabic: FeatureEnum,
  stress: FeatureEnum,
  long: FeatureEnum,
  consonantal: FeatureEnum,
  sonorant: FeatureEnum,
  continuant: FeatureEnum,
  'delayed release': FeatureEnum,
  approximant: FeatureEnum,
  nasal: FeatureEnum,
  tap: FeatureEnum,
  trill: FeatureEnum,

  voice: FeatureEnum,
  'spread gl': FeatureEnum,
  'constr gl': FeatureEnum,

  labial: FeatureEnum,
  round: FeatureEnum,
  labiodental: FeatureEnum,
  coronal: FeatureEnum,
  anterior: FeatureEnum,
  distributed: FeatureEnum,
  strident: FeatureEnum,
  lateral: FeatureEnum,
  dorsal: FeatureEnum,

  high: FeatureEnum,
  low: FeatureEnum,
  front: FeatureEnum,
  back: FeatureEnum,
  tense: FeatureEnum,
});

export function serializeSound(sound: Sound) {
  return Object.keys(sound).filter((key) => key !== 'symbol').reduce((obj, feature) => ({
    ...obj, [feature]: (obj[feature] === 0 ? '0' : (obj[feature] ? '+' : '-')),
  }), { symbol: sound.symbol });
}

export function deserializeSound(sound: any) {
  return Object.keys(sound).filter((key) => key !== 'symbol').reduce((obj, feature) => ({
    ...obj, [feature]: ({ 0: 0, '+': true, '-': false }[obj[feature]]),
  }), { symbol: sound.symbol });
}

export default mongoose.models.Sound || mongoose.model<Sound>('Sound', SoundSchema);
