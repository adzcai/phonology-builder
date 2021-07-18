import Head from 'next/head';
import React, {
  useCallback, useState,
} from 'react';
import useSWR from 'swr';
import {
  BrowserRouter as Router, Switch, Route, Link,
} from 'react-router-dom';
import {
  TableContext, matchFeatures, toggleInArray, allHeights as rawHeights, allSounds as rawSounds,
} from '../src/assets/ipa-data';
import NeighborInspector from '../src/components/NeighborInspector';
import FilterFeatures from '../src/components/IndexPage/FilterFeatures';
import ConsonantTable from '../src/components/IpaTable/ConsonantTable';
import VowelTable from '../src/components/IpaTable/VowelTable';
import AboutSection from '../src/components/IndexPage/AboutSection';
import ListSoundsSection from '../src/components/IndexPage/ListSoundsSection';
import SelectSoundsSection from '../src/components/IndexPage/SelectSoundsSection';
import {
  Diacritic, FeatureFilter, Height, Sound,
} from '../src/lib/types';

export default function Home() {
  const { data: user, mutate: mutateUser } = useSWR('/api/user');

  const [allSounds, setAllSounds] = useState<Sound[]>(rawSounds);
  const [selectedSounds, setSelectedSounds] = useState<Sound[]>([]);
  const [neighbor, setNeighbor] = useState<Sound | null>(null);
  const [selectedDiacritics, setSelectedDiacritics] = useState<Diacritic[]>([]);
  const [allHeights, setAllHeights] = useState<Height[]>(rawHeights);

  const handleDiacriticClick = (diacritic) => setSelectedDiacritics(
    toggleInArray(selectedDiacritics, diacritic),
  );

  const deleteFeatureSet = useCallback(({ features }: FeatureFilter) => {
    setAllSounds((prev) => prev.filter(
      (sound) => matchFeatures([sound.features], features).length === 0,
    ));
  }, []);

  const paths = [
    {
      path: '/',
      color: 'bg-green-300',
      title: 'About',
      children: <AboutSection user={user} mutateUser={mutateUser} />,
    },
    {
      path: '/select-sounds',
      color: 'bg-red-100',
      title: 'Choose sounds',
      children: <SelectSoundsSection
        user={user}
        mutateUser={mutateUser}
        allHeights={allHeights}
        setAllHeights={setAllHeights}
      />,
    },
    {
      path: '/view-inventory',
      color: 'bg-green-100',
      title: 'View inventory',
      children: selectedSounds.length > 0 ? (
        <>
          <ConsonantTable editable={false} />
          <VowelTable
            allHeights={allHeights}
            setAllHeights={setAllHeights}
            editable={false}
          />
        </>
      ) : <p className="text-center">Begin selecting symbols to view a display chart!</p>,
    },
    {
      path: '/list-sounds',
      color: 'bg-yellow-200',
      title: 'List sounds',
      children: <ListSoundsSection sounds={selectedSounds} />,
    },
    {
      path: '/compare-sounds',
      color: 'bg-purple-200',
      title: 'Compare sounds',
      children: <NeighborInspector />,
    },
    {
      path: '/filter-sounds',
      color: 'bg-red-200',
      title: 'Filter sounds',
      children: <FilterFeatures />,
    },
    {
      path: '/upcoming',
      color: 'bg-purple-300',
      title: 'Upcoming features',
      children: (
        <ul className="flex flex-col items-center space-y-2">
          <li>
            Create and save inventories
          </li>
          <li>
            Apply sound changes
          </li>
          <li>
            Play sound audio files
          </li>
        </ul>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-blue-300">
      <Head>
        <title>Phonology Builder</title>
      </Head>

      <header className="p-8 md:py-12 bg-gradient-to-br from-purple-300 to-indigo-300 w-full flex flex-col items-center space-y-8">
        <h1 className="text-4xl text-center">Phonetic Inventory Builder</h1>
      </header>

      {typeof window !== 'undefined' && (
      <Router>
        <nav className="bg-indigo-800 md:bg-gradient-to-tr from-purple-300 to-indigo-300 p-8 md:p-0">
          {/* MANUALLY CHANGE GRID COLS WHEN PATHS CHANGES */}
          <ul className="grid items-stretch grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 md:gap-0">
            {paths.map(({ path, color, title }) => (
              <Link key={path} to={path} className={`text-center p-2 rounded-2xl md:rounded-b-none ${color}`}><li>{title}</li></Link>
            ))}
          </ul>
        </nav>
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
          <Switch>
            {/* Slice here to put index last while keeping it at front of navbar */}
            {[...paths.slice(1), paths[0]].map(({
              path, color, title, children,
            }) => (
              <Route path={path} key={path}>
                <section className={`py-8 px-4 flex flex-col space-y-8 items-center ${color}`}>
                  <h2 className="text-center text-2xl">{title}</h2>
                  {children}
                </section>
              </Route>
            ))}
          </Switch>
        </TableContext.Provider>
      </Router>
      )}

      <footer className="p-4">
        <p className="text-center py-2 max-w-md mx-auto">
          Made by Alexander Cai (c) May 2021 under the MIT License.
          Built with Next.js and Tailwind CSS.
          {' '}
          <a href="https://github.com/pi-guy-in-the-sky/phonology-builder" className="underline">GitHub here.</a>
        </p>
      </footer>
    </div>
  );
}
