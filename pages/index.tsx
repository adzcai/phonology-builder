import Head from 'next/head';
import {
  PropsWithChildren, useCallback, useState,
} from 'react';
import {
  Sound, TableContext, Diacritic, rawSounds, FeatureSet, matchFeatures,
  toggleInArray,
} from '../src/assets/ipaData';
import IpaTable from '../src/components/IpaTable/IpaTable';
import FeatureList from '../src/components/FeatureList';
import NeighborInspector from '../src/components/NeighborInspector';
import FilterFeatures from '../src/components/FilterFeatures';

const Heading = ({ children }: PropsWithChildren<{}>) => (
  <h1 className="text-center text-2xl mb-8">{children}</h1>
);

const Section = ({
  children, heading, classes,
}: PropsWithChildren<{ heading: string, classes?: string }>) => (
  <section className={`py-8 px-4 ${classes}`}>
    <Heading>{heading}</Heading>
    {children}
  </section>
);

export default function Home() {
  const [allSounds, setAllSounds] = useState<Sound[]>(rawSounds);
  const [selectedSounds, setSelectedSounds] = useState<Sound[]>([]);
  const [neighbor, setNeighbor] = useState<Sound | null>(null);
  const [selectedDiacritics, setSelectedDiacritics] = useState<Diacritic[]>([]);

  const resetAll = useCallback(() => {
    setAllSounds(rawSounds);
    setSelectedSounds([]);
    setNeighbor(null);
    setSelectedDiacritics([]);
  }, []);

  const handleDiacriticClick = (diacritic) => setSelectedDiacritics(
    toggleInArray(selectedDiacritics, diacritic),
  );

  const deleteFeatureSet = useCallback(({ features }: FeatureSet) => {
    setAllSounds((prev) => prev
      .filter((sound) => !matchFeatures([sound], features, { syllabic: true })));
  }, []);

  return (
    <div>
      <Head>
        <title>Phonology Creator</title>
      </Head>
      <header className="bg-purple-200">
        <div className="flex items-center justify-evenly py-4">
          <button
            type="button"
            className="px-2 py-2 bg-blue-300 hover:bg-blue-500 rounded"
            onClick={() => setSelectedSounds([])}
          >
            Clear
          </button>
          <button
            type="button"
            className="px-2 py-2 bg-blue-300 hover:bg-blue-500 rounded"
            onClick={resetAll}
          >
            Reset all
          </button>
        </div>
      </header>
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
        <Section heading="Choose sounds" classes="bg-gradient-to-br from-red-100 to-yellow-100">
          <IpaTable editable />
        </Section>
        <Section heading="Phonetic inventory" classes="bg-gradient-to-bl from-blue-100 to-green-100">
          {selectedSounds.length > 0 ? (
            <IpaTable editable={false} />
          ) : <p className="text-center">Begin selecting symbols to view a display chart!</p>}
        </Section>
        <Section heading="List of selected sounds" classes="bg-gradient-to-br from-red-100 to-yellow-100">
          <FeatureList sounds={selectedSounds} />
        </Section>
        <Section heading="Compare sound with neighbors" classes="bg-purple-200">
          <NeighborInspector />
        </Section>
        <Section heading="Filter sounds by feature" classes="bg-blue-200">
          <FilterFeatures />
        </Section>
      </TableContext.Provider>
      <footer className="text-center py-2">Made by Alexander Cai (c) May 2021</footer>
    </div>
  );
}
