import Head from 'next/head';
import React, {
  PropsWithChildren, useCallback, useState,
} from 'react';
import {
  Sound, TableContext, Diacritic, rawSounds, FeatureSet, matchFeatures,
  toggleInArray,
  Height, allHeights as rawHeights,
} from '../src/assets/ipaData';
import FeatureList from '../src/components/FeatureList';
import NeighborInspector from '../src/components/NeighborInspector';
import FilterFeatures from '../src/components/FilterFeatures';
import ConsonantTable from '../src/components/IpaTable/ConsonantTable';
import DiacriticTable from '../src/components/IpaTable/DiacriticTable';
import VowelTable from '../src/components/IpaTable/VowelTable';

const Section = ({
  children, heading, classes,
}: PropsWithChildren<{ heading: string, classes?: string }>) => (
  <section className={`py-8 px-4 ${classes}`}>
    <h2 className="text-center text-2xl mb-8">{heading}</h2>
    {children}
  </section>
);

export default function Home() {
  const [allSounds, setAllSounds] = useState<Sound[]>(rawSounds);
  const [selectedSounds, setSelectedSounds] = useState<Sound[]>([]);
  const [neighbor, setNeighbor] = useState<Sound | null>(null);
  const [selectedDiacritics, setSelectedDiacritics] = useState<Diacritic[]>([]);
  const [allHeights, setAllHeights] = useState<Height[]>(rawHeights);

  const resetAll = useCallback(() => {
    setAllSounds(rawSounds);
    setSelectedSounds([]);
    setNeighbor(null);
    setSelectedDiacritics([]);
    setAllHeights(rawHeights);
  }, []);

  const handleDiacriticClick = (diacritic) => setSelectedDiacritics(
    toggleInArray(selectedDiacritics, diacritic),
  );

  const deleteFeatureSet = useCallback(({ features }: FeatureSet) => {
    setAllSounds(allSounds.filter((sound) => !matchFeatures([sound], features).length));
  }, []);

  return (
    <div>
      <Head>
        <title>Phonology Creator</title>
      </Head>

      <header className="p-8 md:py-12 bg-gradient-to-br from-purple-300 to-indigo-300">
        <h1 className="text-4xl text-center">Phonetic Inventory Builder</h1>
        <p className="mt-8 mx-auto max-w-lg text-center">
          Based on the
          {' '}
          <a href="https://linguistics.ucla.edu/people/hayes/120a/Pheatures/" className="underline">Pheatures</a>
          {' '}
          program by UCLA.
          <br />
          This is an application made by Alexander Cai for exploring phonological features.
          <br />
          All functionality with diacritics is currently experimental.
          <br />
          Please report bugs or suggestions on
          {' '}
          <a href="https://github.com/pi-guy-in-the-sky/phonology-builder/issues" className="underline">
            GitHub
          </a>
          .
        </p>
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
          <ul className="mx-auto text-center p-4 max-w-lg w-full md:w-max space-y-2 bg-pink-300 rounded-2xl">
            <li>
              Hover over a row or column to see the features that define it.
            </li>
            <li>
              Click a sound to toggle selecting it.
            </li>
            <li>
              Shift-click a sound to compare it with other sounds
              in the &apos;Compare sound with neighbors&apos; section.
            </li>
            <li>
              Alt-click a sound to remove it from the table.
            </li>
            <li>
              Click the
              {' '}
              <span className="bg-red-200 px-2 rounded">-</span>
              {' '}
              buttons to remove rows and columns.
            </li>
          </ul>

          <div className="flex items-center justify-evenly mt-8">
            <button
              type="button"
              className="hover-blue p-2 rounded"
              onClick={() => setSelectedSounds([])}
            >
              Clear
            </button>
            <button
              type="button"
              className="hover-blue p-2 rounded"
              onClick={resetAll}
            >
              Reset all
            </button>
          </div>

          <div className="grid w-full grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
            <div className="lg:col-span-3">
              <ConsonantTable editable />
            </div>
            <div className="lg:col-span-3">
              <VowelTable
                allHeights={allHeights}
                setAllHeights={setAllHeights}
                editable
              />
            </div>
            <div className="lg:row-span-2 lg:row-start-1">
              <DiacriticTable>
                Click a diacritic to select it, then click a sound to apply it.
              </DiacriticTable>
            </div>
          </div>
        </Section>

        <Section heading="Phonetic inventory" classes="bg-gradient-to-bl from-blue-100 to-green-100">
          {selectedSounds.length > 0 ? (
            <div>
              <div>
                <ConsonantTable editable={false} />
              </div>
              <div className="mt-8">
                <VowelTable
                  allHeights={allHeights}
                  setAllHeights={setAllHeights}
                  editable={false}
                />
              </div>
            </div>
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

      <Section heading="Upcoming features" classes="bg-purple-300">
        <ul className="flex flex-col items-center space-y-2">
          <li>
            Create and save inventories
          </li>
          <li>
            Apply sound changes
          </li>
          <li>
            Detailed descriptions of features
          </li>
        </ul>
      </Section>

      <footer className="bg-blue-300 p-4">
        <p className="text-center py-2 max-w-md mx-auto">
          Made by Alexander Cai (c) May 2021 under the MIT License.
          Built with Next.js and Tailwind CSS.
        </p>
      </footer>
    </div>
  );
}
