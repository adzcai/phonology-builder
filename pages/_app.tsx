import { useState, useCallback, useEffect } from 'react';
import { SWRConfig } from 'swr';
import {
  toggleInArray, filterFeatures, TableContext, allSounds as rawSounds, allHeights as rawHeights,
  HeightsContext,
} from '../src/assets/ipa-data';
import fetch from '../src/lib/fetchJson';
import {
  Sound, Diacritic, FeatureFilter, Chart,
} from '../src/lib/types';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [allSounds, setAllSounds] = useState<Sound[]>(rawSounds);
  const [selectedSounds, setSelectedSounds] = useState<Sound[]>([]);
  const [neighbor, setNeighbor] = useState<Sound | null>(null);
  const [selectedDiacritics, setSelectedDiacritics] = useState<Diacritic[]>([]);
  const [allHeights, setAllHeights] = useState(rawHeights);
  const [selectedChart, setSelectedChart] = useState<Chart | null>(null);

  const handleDiacriticClick = (diacritic) => setSelectedDiacritics(
    toggleInArray(selectedDiacritics, diacritic),
  );

  const deleteFeatureSet = useCallback(({ features }: FeatureFilter) => {
    setAllSounds((prev) => prev.filter(
      (sound) => filterFeatures([sound.features], features).length === 0,
    ));
  }, []);

  useEffect(() => {
    if (selectedChart !== null) setSelectedSounds(selectedChart.sounds);
  }, [selectedChart]);

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
        selectedChart,
        setSelectedChart,
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
