import rawFeatureData from './feature-data.json';
import rawSounds from './base-features.json';
import rawDiacritics from './diacritics.json';
import {
  Manner, Place, Diacritic, Features, Height, Phoneme, Frontness,
} from '../lib/client/types';

// the two features missing from the original book are
// implosive and ATR (equivalent to tense in some languages)
export const allSounds = rawSounds.map(({ symbol, ...features }) => ({
  symbol,
  features,
})) as Phoneme[];

// Descriptions of the supported features in the form [name, category, description].
export const allFeatures = rawFeatureData.features as [keyof Features, string, string][];

export const allManners = rawFeatureData.manners as Manner[];
export const allPlaces = rawFeatureData.places as Place[];
export const allFrontnesses = rawFeatureData.frontnesses as Frontness[];
export const allHeights = rawFeatureData.heights as Height[];
export const allDiacritics = rawDiacritics as Diacritic[];
