import { useState, useCallback, useEffect } from 'react';
import { SWRConfig } from 'swr';
import type { AppProps } from 'next/app';
import {
  allSounds as rawSounds, allHeights as rawHeights,
} from '../src/assets/ipa-data';
import Layout from '../src/components/Layout';
import type { ChartDocument } from '../src/lib/api/apiTypes';
import { TableContext, HeightsContext, RulesContext } from '../src/lib/client/context';
import fetcher from '../src/lib/client/fetcher';
import {
  Phoneme, Diacritic, FeatureFilter, Rule, WordTransformations,
} from '../src/lib/client/types';
import { toggleInArray, filterFeatures, createRule } from '../src/lib/client/util';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const [allSounds, setAllSounds] = useState<Phoneme[]>(rawSounds);
  const [selectedSounds, setSelectedSounds] = useState<Phoneme[]>([]);
  const [neighbor, setNeighbor] = useState<Phoneme | null>(null);
  const [selectedDiacritics, setSelectedDiacritics] = useState<Diacritic[]>([]);
  const [allHeights, setAllHeights] = useState(rawHeights);
  const [selectedChart, setSelectedChart] = useState<ChartDocument | null>(null);
  const [words, setWords] = useState<string[]>([]);
  const [wordTransformations, setWordTransformations] = useState<WordTransformations>({});
  const [rules, setRules] = useState<Rule[]>([createRule()]);

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
      console.log({ selectedChart });
      setSelectedSounds(selectedChart.sounds);
      setWords(selectedChart.words);
    }
  }, [selectedChart]);

  return (
    <SWRConfig value={{ fetcher }}>
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
          <RulesContext.Provider value={{
            selectedChart,
            setSelectedChart,
            words,
            setWords,
            wordTransformations,
            setWordTransformations,
            rules,
            setRules,
          }}
          >
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </RulesContext.Provider>
        </HeightsContext.Provider>
      </TableContext.Provider>
    </SWRConfig>
  );
}

export default MyApp;
