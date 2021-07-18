import { useState, useCallback } from 'react';
import { SWRConfig } from 'swr';
import {
  toggleInArray, matchFeatures, TableContext, allSounds as rawSounds, allHeights as rawHeights,
  HeightsContext,
} from '../src/assets/ipa-data';
import fetch from '../src/lib/fetchJson';
import { Sound, Diacritic, FeatureFilter } from '../src/lib/types';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [allSounds, setAllSounds] = useState<Sound[]>(rawSounds);
  const [selectedSounds, setSelectedSounds] = useState<Sound[]>([]);
  const [neighbor, setNeighbor] = useState<Sound | null>(null);
  const [selectedDiacritics, setSelectedDiacritics] = useState<Diacritic[]>([]);
  const [allHeights, setAllHeights] = useState(rawHeights);

  const handleDiacriticClick = (diacritic) => setSelectedDiacritics(
    toggleInArray(selectedDiacritics, diacritic),
  );

  const deleteFeatureSet = useCallback(({ features }: FeatureFilter) => {
    setAllSounds((prev) => prev.filter(
      (sound) => matchFeatures([sound.features], features).length === 0,
    ));
  }, []);

  return (
    <SWRConfig
      value={{
        fetcher: fetch,
        onError: (err) => {
          console.error(err);
        },
      }}
    >
      <TableContext.Provider value={{
        allSounds,
        setAllSounds,
        selectedSounds,
        setSelectedSounds,
        neighbor,
        setNeighbor,
        selectedDiacritics,
        setSelectedDiacritics,
        handleDiacriticClick,
        deleteFeatureSet,
      }}
      >
        <HeightsContext.Provider value={{
          allHeights,
          setAllHeights,
        }}
        >
          <Component {...pageProps} />
        </HeightsContext.Provider>
      </TableContext.Provider>
    </SWRConfig>
  );
}

export default MyApp;
