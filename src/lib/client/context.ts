import { createContext, Dispatch, SetStateAction } from 'react';
import useSWR from 'swr';
import { ChartDocument } from '../api/apiTypes';
import {
  Phoneme, SoundHook, Diacritic, FeatureFilter, Height, Rule, WordTransformations,
} from './types';

// all of the optional fields are for the FilterFeature component to work properly
type TableContextType = {
  allSounds?: Phoneme[];
  setAllSounds?: SoundHook;
  selectedSounds: Phoneme[];
  setSelectedSounds?: SoundHook;
  neighbor?: Phoneme | null;
  setNeighbor?: Dispatch<SetStateAction<Phoneme | null>>;
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
  selectedChart: ChartDocument;
  setSelectedChart: Dispatch<SetStateAction<ChartDocument>>;
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

type UserPayload = {
  user?: { isLoggedIn: true, username: string };
  userIsValidating: boolean;
  userError?: Error & {
    info: {
      message: string;
    };
    status: number;
  };
  mutateUser: (data?: any, shouldRevalidate?: boolean) => Promise<any>;
};

export function useUser(): UserPayload {
  const {
    data, error, isValidating, mutate,
  } = useSWR('/api/user');

  return {
    user: data,
    userIsValidating: isValidating,
    userError: error,
    mutateUser: mutate,
  };
}
