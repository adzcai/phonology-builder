import React, {
  useCallback, useContext,
} from 'react';
import useSWR from 'swr';
import {
  allHeights as rawHeights, allSounds as rawSounds,
} from '../src/assets/ipa-data';
import ConsonantTable from '../src/components/IpaTable/ConsonantTable';
import DiacriticTable from '../src/components/IpaTable/DiacriticTable';
import VowelTable from '../src/components/IpaTable/VowelTable';
import RequireUser from '../src/components/RequireUser';
import UserCharts from '../src/components/SelectSoundsPage/UserCharts';
import { GlobalContext, useUser } from '../src/lib/client/context';
import fetcher from '../src/lib/client/fetcher';

function SaveChartComponent() {
  const { user } = useUser();
  const { selectedSounds } = useContext(GlobalContext);
  const { data: charts, mutate: mutateCharts, error: chartsError } = useSWR(() => `/api/charts/${user.username}`);
  const handleSaveSounds = useCallback(async (e) => {
    e.preventDefault();

    try {
      const newChart = { sounds: selectedSounds, name: e.currentTarget['chart-name'].value };

      console.log({ newChart });

      await mutateCharts([...charts, newChart]);
      await fetcher(`/api/charts/${user.username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newChart),
      });
      await mutateCharts();
      console.log('result', { charts });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('An unexpected error happened:', err.info.message);
      alert(err.info.message);
    }
  }, [selectedSounds, charts, user]);

  if (chartsError) {
    return (
      <p>
        Error loading charts:
        {' '}
        {chartsError.info.message}
      </p>
    );
  }

  if (!charts) {
    return <p>Loading...</p>;
  }

  return (
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
          Save as chart
        </button>
      </form>
    </>
  );
}

export default function SelectSoundsPage() {
  const {
    allSounds, setAllSounds,
    setSelectedSounds, setNeighbor, setSelectedDiacritics, allHeights, setAllHeights,
  } = useContext(GlobalContext);

  const resetAll = useCallback(() => {
    setAllSounds(rawSounds);
    setSelectedSounds([]);
    setNeighbor(null);
    setSelectedDiacritics([]);
    setAllHeights(rawHeights);
  }, []);

  return (
    <>
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
        <RequireUser>
          <SaveChartComponent />
        </RequireUser>
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

      <RequireUser>
        <h2 className="text-2xl font-bold">Your charts</h2>
        <UserCharts />
      </RequireUser>
    </>
  );
}
