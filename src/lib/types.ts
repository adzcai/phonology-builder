import { NextApiRequest } from 'next';
import { Dispatch, SetStateAction } from 'react';

export type Features = {
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

export type Condition = Partial<Features> | ((_: Features) => boolean) | Condition[];

export type FeatureFilter = {
  name: string,
  features: Condition;
};

export type Sound = {
  symbol: string;
  features: Features
};

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

export type SoundHook = Dispatch<SetStateAction<Sound[]>>;

export type CustomRequest = NextApiRequest & { session: any };

export type User = {
  username: string;
  charts: Chart[];
};

export type Chart = {
  _id: string,
  name: string,
  sounds: Sound[],
  parent: {
    chart: Chart,
    evolutionFromParent: Evolution
  } | null
};

export type Rule = {
  src: SerializedFeatureList[],
  dst: SerializedFeatureList[],
  preceding: SerializedFeatureList[],
  following: SerializedFeatureList[]
};

export type Evolution = {
  rules: Rule[]
};

// all of the optional fields are for the FilterFeature component to work properly
export type TableContextType = {
  allSounds?: Sound[];
  setAllSounds?: SoundHook;
  selectedSounds: Sound[];
  setSelectedSounds?: SoundHook;
  neighbor?: Sound | null;
  setNeighbor?: Dispatch<SetStateAction<Sound | null>>;
  selectedDiacritics: Diacritic[] | null;
  setSelectedDiacritics: Dispatch<SetStateAction<Diacritic[]>>;
  selectedChart: Chart | null;
  setSelectedChart: Dispatch<SetStateAction<Chart>>;
  handleDiacriticClick: (diacritic: Diacritic) => void;
  deleteFeatureSet?: (featureSet: FeatureFilter) => void;
};

export type HeightsContextType = {
  allHeights: Height[];
  setAllHeights: Dispatch<SetStateAction<FeatureFilter[]>>;
};

export type SerializedFeatureValue = '+' | '-' | '0';

export type SerializedFeatureList = [keyof Features, SerializedFeatureValue][];
