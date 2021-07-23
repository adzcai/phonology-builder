import { useState, useCallback, useEffect } from 'react';
import { SWRConfig } from 'swr';
import type { AppProps } from 'next/app';
import {
  allSounds as rawSounds, allHeights as rawHeights,
} from '../src/assets/ipa-data';
import Layout from '../src/components/Layout';
import { GlobalContext } from '../src/lib/client/context';
import fetcher from '../src/lib/client/fetcher';
import type {
  Phoneme, Diacritic, FeatureFilter, Chart,
} from '../src/lib/client/types';
import { toggleInArray, filterFeatures } from '../src/lib/client/util';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const [allSounds, setAllSounds] = useState<Phoneme[]>(rawSounds);
  const [selectedSounds, setSelectedSounds] = useState<Phoneme[]>([]);
  const [neighbor, setNeighbor] = useState<Phoneme | null>(null);
  const [selectedDiacritics, setSelectedDiacritics] = useState<Diacritic[]>([]);
  const [allHeights, setAllHeights] = useState(rawHeights);
  const [selectedChart, setSelectedChart] = useState<Chart>(null);

  const handleDiacriticClick = (diacritic) => setSelectedDiacritics(
    toggleInArray(selectedDiacritics, diacritic),
  );

  const deleteFeatureSet = useCallback(({ features }: FeatureFilter) => {
    setAllSounds((prev) => prev.filter(
      (sound) => filterFeatures([sound.features], features).length === 0,
    ));
  }, []);

  useEffect(() => {
    if (selectedChart !== null) {
      setSelectedSounds(selectedChart.sounds);
    }
  }, [selectedChart]);

  return (
    <SWRConfig value={{ fetcher }}>
      <GlobalContext.Provider value={{
        allSounds,
        setAllSounds,

        selectedSounds,
        setSelectedSounds,

        allHeights,
        setAllHeights,

        neighbor,
        setNeighbor,

        selectedDiacritics,
        setSelectedDiacritics,

        selectedChart,
        setSelectedChart,

        handleDiacriticClick,
        deleteFeatureSet,
      }}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </GlobalContext.Provider>
    </SWRConfig>
  );
}

export default MyApp;
