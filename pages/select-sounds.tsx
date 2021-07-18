import React, {
  useCallback, useContext, useState,
} from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import {
  allHeights as rawHeights, TableContext, allSounds as rawSounds, HeightsContext,
} from '../src/assets/ipa-data';
import fetchJson from '../src/lib/fetchJson';
import ConsonantTable from '../src/components/IpaTable/ConsonantTable';
import DiacriticTable from '../src/components/IpaTable/DiacriticTable';
import VowelTable from '../src/components/IpaTable/VowelTable';
import Layout from '../src/components/Layout';

const UserCharts = ({ user }: { user: any }) => {
  const { setSelectedSounds } = useContext(TableContext);

  if (!user) return <p>Loading...</p>;

  if (user.errorMessage) {
    console.error(user.errorMessage);
    return (
      <p>
        An error occurred:
        {user.errorMessage}
      </p>
    );
  }

  if (!user.data.isLoggedIn) {
    return (
      <p>
        <Link to="/" className="underline">Sign up</Link>
        {' '}
        to save your own sound charts!
      </p>
    );
  }

  if (user.data.charts.length === 0) return <p>Save some charts!</p>;

  return (
    <>
      <p className="mx-auto w-full text-center">Click a chart to load it!</p>
      <ul className="flex flex-wrap gap-4 justify-center">
        {user.data.charts.map(({ name, sounds }) => (
          <li key={name}>
            <button
              type="button"
              className="bg-green-300 hover:bg-green-500 drop-shadow rounded p-2"
              onClick={() => {
                console.log(sounds);
                setSelectedSounds(sounds);
              }}
            >
              {name}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default function SelectSoundsPage() {
  const { data: user, mutate: mutateUser } = useSWR('/api/user');

  const {
    selectedSounds, setAllSounds, allSounds, setSelectedSounds, setNeighbor, setSelectedDiacritics,
  } = useContext(TableContext);
  const { allHeights, setAllHeights } = useContext(HeightsContext);

  const [saveErrorMsg, setSaveErrorMsg] = useState('');

  async function handleSaveSounds(e) {
    e.preventDefault();

    const body = { sounds: selectedSounds, name: e.currentTarget['chart-name'].value };

    try {
      const newUser = await fetchJson('/api/user/charts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      await mutateUser(newUser);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('An unexpected error happened:', error);
      setSaveErrorMsg(`An unexpected error occurred: ${error.data.message || error.message}`);
    }
  }

  const resetAll = useCallback(() => {
    setAllSounds(rawSounds);
    setSelectedSounds([]);
    setNeighbor(null);
    setSelectedDiacritics([]);
    setAllHeights(rawHeights);
  }, []);

  return (
    <Layout>
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

      <div className="flex flex-col md:flex-row items-center justify-evenly space-y-4 md:space-y-0 w-full mt-8">
        <div>
          <button
            type="button"
            className="hover-blue p-2 rounded"
            onClick={() => setSelectedSounds([])}
          >
            Clear selection
          </button>
          <button
            type="button"
            className="hover-blue p-2 rounded ml-4"
            onClick={resetAll}
          >
            Reset all
          </button>
          <button
            type="button"
            className="hover-blue p-2 rounded ml-4"
            onClick={() => setSelectedSounds(allSounds)}
          >
            Select all
          </button>
        </div>
        {user?.data?.isLoggedIn && (
        <>
          <form onSubmit={handleSaveSounds} className="flex flex-col items-center space-y-4">
            <label htmlFor="chart-name" className="contents space-y-2 md:space-y-0 md:space-x-2">
              <span>Chart name</span>
              <input
                type="text"
                id="chart-name"
                name="chart-name"
                required
                className="pl-1.5 rounded-lg outline-none shadow focus:shadow-lg transition-shadow"
                placeholder="Enter chart name"
              />
            </label>
            <button
              type="submit"
              className="hover-blue p-2 rounded"
            >
              Save selected sounds
            </button>
          </form>

          {saveErrorMsg}
        </>
        )}
      </div>

      <div className="flex flex-col w-full items-center space-y-8">
        <div className="flex flex-col items-center space-y-8 w-full max-w-full lg:flex-row lg:space-y-0 lg:space-x-8">
          {/* <div style={{ flexBasis: 'fill' }}> */}
          <ConsonantTable editable />
          {/* </div> */}
          {/* <div style={{ flexBasis: 'fill' }}> */}
          <VowelTable
            allHeights={allHeights}
            setAllHeights={setAllHeights}
            editable
          />
          {/* </div> */}
        </div>
        <DiacriticTable>
          Click a diacritic to select it, then click a sound to apply it.
        </DiacriticTable>
      </div>

      {/* undefined > 0 is false, so this only works if the user has positive charts */}
      <h2 className="text-2xl font-bold">Your charts</h2>
      <UserCharts user={user} />
    </Layout>
  );
}