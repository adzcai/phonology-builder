import mongoose from 'mongoose';
import { Sound } from '../lib/types';

// Remember to update this whenever schema changes and vice versa

// note that it is not required, so that we can store subsets of features
// eg for sound evolution
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

export default mongoose.models.Sound || mongoose.model<Sound>('Sound', SoundSchema);
