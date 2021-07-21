import { useState, useCallback, useEffect } from 'react';
import { SWRConfig } from 'swr';
import {
  allSounds as rawSounds, allHeights as rawHeights,
} from '../src/assets/ipa-data';
import { TableContext, HeightsContext, RulesContext } from '../src/lib/context';
import fetcher from '../src/lib/fetchJson';
import {
  Sound, Diacritic, FeatureFilter, Chart, Rule, WordTransformations,
} from '../src/lib/types';
import { toggleInArray, filterFeatures, createRule } from '../src/lib/util';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [allSounds, setAllSounds] = useState<Sound[]>(rawSounds);
  const [selectedSounds, setSelectedSounds] = useState<Sound[]>([]);
  const [neighbor, setNeighbor] = useState<Sound | null>(null);
  const [selectedDiacritics, setSelectedDiacritics] = useState<Diacritic[]>([]);
  const [allHeights, setAllHeights] = useState(rawHeights);
  const [selectedChart, setSelectedChart] = useState<Chart | null>(null);
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
    <SWRConfig
      value={{
        fetcher,
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
            <Component {...pageProps} />
          </RulesContext.Provider>
        </HeightsContext.Provider>
      </TableContext.Provider>
    </SWRConfig>
  );
}

export default MyApp;
