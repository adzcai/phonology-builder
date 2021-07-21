import { createContext, Dispatch, SetStateAction } from 'react';
import {
  Sound, SoundHook, Diacritic, Chart, FeatureFilter, Height, Rule,
} from './types';

// all of the optional fields are for the FilterFeature component to work properly
type TableContextType = {
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

export const TableContext = createContext<TableContextType>({
  allSounds: [],
  setAllSounds: () => {},
  selectedSounds: [],
  setSelectedSounds: () => {},
  neighbor: null,
  setNeighbor: () => {},
  selectedDiacritics: null,
  setSelectedDiacritics: () => {},
  selectedChart: null,
  setSelectedChart: () => {},
  handleDiacriticClick: () => {},
  deleteFeatureSet: () => {},
});

type HeightsContextType = {
  allHeights: Height[];
  setAllHeights: Dispatch<SetStateAction<FeatureFilter[]>>;
};

export const HeightsContext = createContext<HeightsContextType>({
  allHeights: [],
  setAllHeights: () => {},
});

type RulesContextType = {
  words: string[];
  setWords: Dispatch<SetStateAction<string[]>>;
  rules: Rule[];
  setRules: Dispatch<SetStateAction<Rule[]>>;
};

export const RulesContext = createContext<RulesContextType>({
  words: [],
  setWords: () => {},
  rules: [],
  setRules: () => {},
});
