import { createContext, Dispatch, SetStateAction } from 'react';
import {
  Sound, SoundHook, Diacritic, Chart, FeatureFilter, Height, Rule, WordTransformations,
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
  selectedChart: Chart;
  setSelectedChart: Dispatch<SetStateAction<Chart>>;
  words: string[];
  setWords: Dispatch<SetStateAction<string[]>>;
  wordTransformations: WordTransformations;
  setWordTransformations: Dispatch<SetStateAction<WordTransformations>>;
  rules: Rule[];
  setRules: Dispatch<SetStateAction<Rule[]>>;
};

export const RulesContext = createContext<RulesContextType>({
  selectedChart: null,
  setSelectedChart: () => {},
  words: [],
  setWords: () => {},
  wordTransformations: {},
  setWordTransformations: () => {},
  rules: [],
  setRules: () => {},
});
