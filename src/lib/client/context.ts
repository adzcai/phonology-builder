import { createContext, Dispatch, SetStateAction } from 'react';
import useSWR from 'swr';
import type {
  Phoneme, SoundHook, Diacritic, FeatureFilter, Height, User, Chart,
} from './types';

// all of the optional fields are for the FilterFeature component to work properly
type GlobalContextType = {
  allSounds?: Phoneme[];
  setAllSounds?: SoundHook;

  selectedSounds: Phoneme[];
  setSelectedSounds?: SoundHook;

  neighbor?: Phoneme | null;
  setNeighbor?: Dispatch<SetStateAction<Phoneme | null>>;

  selectedDiacritics: Diacritic[] | null;
  setSelectedDiacritics: Dispatch<SetStateAction<Diacritic[]>>;

  selectedChart: Chart;
  setSelectedChart: Dispatch<SetStateAction<Chart>>;

  allHeights: Height[];
  setAllHeights: Dispatch<SetStateAction<FeatureFilter[]>>;

  handleDiacriticClick: (diacritic: Diacritic) => void;
  deleteFeatureSet?: (featureSet: FeatureFilter) => void;
};

export const GlobalContext = createContext<GlobalContextType>({
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

  allHeights: [],
  setAllHeights: () => {},

  handleDiacriticClick: () => {},
  deleteFeatureSet: () => {},
});

export function useUser() {
  const {
    data, error, mutate,
  } = useSWR<User>('/api/user');

  return {
    user: data,
    userError: error,
    mutateUser: mutate,
  };
}

export function useCharts(user: User) {
  const { data, error, mutate } = useSWR<Chart[]>(() => `/api/charts/${user.username}`);
  return {
    charts: data,
    chartsError: error,
    mutateCharts: mutate,
  };
}

export function useWords(selectedChart) {
  const { data, mutate, error } = useSWR(() => `/api/charts/${selectedChart._id}/words`);

  return {
    words: data,
    wordsError: error,
    mutateWords: mutate,
  };
}
