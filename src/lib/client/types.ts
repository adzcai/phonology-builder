import { Dispatch, SetStateAction } from 'react';

export type Feature =
  | 'syllabic' | 'consonantal' | 'approximant' | 'sonorant' | 'continuant' | 'delayed release'
  | 'nasal' | 'tap' | 'trill'
  | 'voice' | 'spread gl' | 'constr gl'
  | 'labial' | 'round' | 'labiodental' | 'coronal' | 'anterior' | 'distributed' | 'strident' | 'lateral' | 'dorsal'
  | 'high' | 'low' | 'front' | 'back' | 'tense'
  | 'stress' | 'long';

export type Features = {
  [key in Feature]: boolean | 0;
};

export type Condition = Partial<Features> | ((_: Features) => boolean) | Condition[];

export type FeatureFilter = {
  name: string,
  features: Condition;
};

export type User = { isLoggedIn: boolean, username?: string };

export type Manner = FeatureFilter;

export type Place = FeatureFilter;

export type Frontness = FeatureFilter;

export type Height = FeatureFilter;

export type Diacritic = {
  name: string,
  symbol: string;
  features: Partial<Features>;
  requirements: Partial<Features>;
  createNewRow: boolean;
};

export type Phoneme = {
  symbol: string;
  features: Features
};

export type SoundHook = Dispatch<SetStateAction<Phoneme[]>>;

export type Evolution = {
  _id: string;
  from: string;
  to: string;
  rules: Rule[];
};

export type SerializedFeatureValue = '+' | '-' | '0';

export type SerializedFeatureList = [keyof Features | '', SerializedFeatureValue][];

export type RuleComponent = SerializedFeatureList | 'null' | 'boundary';

export type Matrix = {
  id: string;
  data: RuleComponent;
};

export type Rule = {
  id: string;
  src: Matrix[];
  dst: Matrix[];
  preceding?: Matrix[];
  following?: Matrix[];
};

export type Chart = {
  _id: string;
  username: string;
  name: string;
  sounds: Phoneme[];
  words: string[];
};
