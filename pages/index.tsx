import Head from 'next/head';
import React, {
  PropsWithChildren, useCallback, useState,
} from 'react';
import useSWR from 'swr';
import {
  Sound, TableContext, Diacritic, FeatureSet, matchFeatures,
  toggleInArray,
  Height, allHeights as rawHeights, allSounds as rawSounds,
} from '../src/assets/ipaData';
import FeatureList from '../src/components/FeatureList';
import NeighborInspector from '../src/components/NeighborInspector';
import FilterFeatures from '../src/components/FilterFeatures';
import ConsonantTable from '../src/components/IpaTable/ConsonantTable';
import DiacriticTable from '../src/components/IpaTable/DiacriticTable';
import VowelTable from '../src/components/IpaTable/VowelTable';
import TableContainer from '../src/components/TableContainer';
import fetchJson from '../src/lib/fetchJson';

const Section = ({
  children, heading, classes,
}: PropsWithChildren<{ heading: string, classes?: string }>) => (
  <section className={`py-8 px-4 ${classes}`}>
    <h2 className="text-center text-2xl mb-8">{heading}</h2>
    {children}
  </section>
);

const TextInput = ({ name, ...props }) => (
  <input
    id={name}
    name={name}
    required
    className="ml-2 pl-2 rounded-lg outline-none shadow focus:shadow-lg transition-shadow"
    {...props}
  />
);

const SonorityHierarchy = () => (
  <Section heading="The sonority hierarchy" classes="bg-yellow-200">
    <TableContainer borderCollapse>
      <thead>
        <tr>
          {['Vowels', 'Glides', 'Liquids', 'Nasals', 'Obstruents'].map((soundClass) => <th key={soundClass} className="border-gray-600 border-4">{soundClass}</th>)}
        </tr>
      </thead>
      <tbody className="text-center">
        <tr>
          <td className="border-gray-600 border-4">[+syllabic]</td>
          <td className="border-gray-600 border-4" colSpan={4}>[-syllabic]</td>
        </tr>
        <tr>
          <td className="border-gray-600 border-4" colSpan={2}>[-consonantal]</td>
          <td className="border-gray-600 border-4" colSpan={3}>[+consonantal]</td>
        </tr>
        <tr>
          <td className="border-gray-600 border-4" colSpan={3}>[+approximant]</td>
          <td className="border-gray-600 border-4" colSpan={2}>[-approximant]</td>
        </tr>
        <tr>
          <td className="border-gray-600 border-4" colSpan={4}>[+sonorant]</td>
          <td className="border-gray-600 border-4">[-sonorant]</td>
        </tr>
      </tbody>
    </TableContainer>
    <div className="mx-auto text-center p-4 max-w-lg w-full md:w-max bg-pink-300 rounded-2xl mt-8">
      <details>
        <summary className="focus:outline-none cursor-pointer">Explanation</summary>
        <ul>
          <li>
            <strong>vowels</strong>
            {' '}
            are [+syllabic];
          </li>
          <li>
            <strong>glides</strong>
            {' '}
            like [j] and [ɹ] are [-syllabic, -consonantal];
          </li>
          <li>
            <strong>liquids</strong>
            {' '}
            like [r] and [l] are [+consonantal], [+approximant];
          </li>
          <li>
            <strong>nasals</strong>
            {' '}
            like [m] and [n] are [-approximant, +sonorant];
          </li>
          <li>
            <strong>obstruents</strong>
            {' '}
            (stops, fricatives, and affricates) are [-sonorant].
          </li>
        </ul>
        <p>
          You can experiment with these using the &quot;Filter sounds by feature&quot;
          utility below.
        </p>
      </details>
    </div>
  </Section>
);

export default function Home() {
  const { data: user, mutate: mutateUser } = useSWR('/api/user');

  const [formState, setFormState] = useState<'Closed' | 'Log in' | 'Sign up'>('Closed');
  const [errorMsg, setErrorMsg] = useState('');
  const [saveErrorMsg, setSaveErrorMsg] = useState('');

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
    setAllSounds((prev) => prev.filter((sound) => matchFeatures([sound], features).length === 0));
  }, []);

  // when user attempts to log in
  async function handleSubmit(e) {
    e.preventDefault();

    const body: { username: string, password: string, confirmPassword?: string } = {
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value,
    };

    if (formState === 'Sign up') body.confirmPassword = e.currentTarget['confirm-password'].value;

    try {
      // will always throw error with { data: ... }
      const sendUser = await fetchJson(formState === 'Log in' ? '/api/login' : '/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      await mutateUser(sendUser);
    } catch (error) {
      console.error('An unexpected error happened:', error);
      setErrorMsg(`An unexpected error occurred: ${error.data.message || error.message}`);
    }
  }

  async function handleSaveSounds(e) {
    e.preventDefault();

    const body = { sounds: selectedSounds, name: e.currentTarget['chart-name'].value };

    try {
      const newUser = await fetchJson('/api/user/charts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      console.dir(newUser);

      await mutateUser(newUser);
    } catch (error) {
      console.error('An unexpected error happened:', error);
      setSaveErrorMsg(`An unexpected error occurred: ${error.data.message || error.message}`);
    }
  }

  return (
    <div>
      <Head>
        <title>Phonology Builder</title>
      </Head>

      <header className="p-8 md:py-12 bg-gradient-to-br from-purple-300 to-indigo-300 w-full flex flex-col items-center space-y-8">
        <h1 className="text-4xl">Phonetic Inventory Builder</h1>
        <p className="max-w-lg text-center">
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

        {user?.isLoggedIn ? (
          <button
            type="button"
            onClick={async () => mutateUser(await fetchJson('/api/logout', { method: 'POST' }))}
            className="bg-pink-300 rounded-xl p-2"
          >
            Logout
          </button>
        ) : (
          <>
            <div className="flex space-x-8 w-max">
              <button type="button" className="rounded-xl bg-pink-300 hover:bg-pink-500 py-2 px-4 shadow-lg hover:shadow-xl transition outline-none" onClick={() => setFormState('Log in')}>
                Log in
              </button>
              <button type="button" className="rounded-xl bg-pink-300 hover:bg-pink-500 py-2 px-4 shadow-lg hover:shadow-xl transition outline-none" onClick={() => setFormState('Sign up')}>
                Sign up
              </button>
            </div>

            {formState !== 'Closed' && (
            <div className="bg-pink-300 w-max max-w-sm p-2 rounded-xl">
              <h3 className="font-bold text-center">{formState}</h3>

              <form onSubmit={handleSubmit} className="w-full mt-4 flex flex-col items-center space-y-4">
                <div className="grid grid-cols-2 gap-x-2 gap-y-4" style={{ gridTemplateColumns: 'auto auto' }}>
                  <label htmlFor="username" className="contents">
                    <span className="text-right">Username</span>
                    <TextInput name="username" type="text" required placeholder="Enter username" />
                  </label>
                  <label htmlFor="password" className="contents">
                    <span className="text-right">Password</span>
                    <TextInput type="password" name="password" required placeholder="Enter password" />
                  </label>
                  {formState === 'Sign up' && (
                  <label htmlFor="confirm-password" className="contents">
                    <span className="text-right">Confirm password</span>
                    <TextInput type="password" name="confirm-password" required placeholder="Confirm password" />
                  </label>
                  )}
                </div>

                <button type="submit" className="hover-blue py-2 px-4 rounded-lg shadow">{formState}</button>

                {errorMsg && <p className="text-center">{errorMsg}</p>}
              </form>
            </div>
            )}
          </>
        )}

      </header>

      <pre>{JSON.stringify(user?.charts[0]?.sounds, null, 2)}</pre>

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

          {/* undefined > 0 is false, so this only works if the user has positive charts */}
          {user?.charts?.length > 0 ? (
            <Section heading="Your sound charts">
              <p className="mx-auto w-full text-center">Click a chart to load it!</p>
              <ul className="flex flex-wrap gap-4 mt-8 justify-center">
                {user.charts.map(({ name, sounds }) => (
                  <li key={name}>
                    <button type="button" className="bg-green-300 hover:bg-green-500 drop-shadow rounded p-2" onClick={() => setSelectedSounds(sounds)}>{name}</button>
                  </li>
                ))}
              </ul>
            </Section>
          ) : <p>Save some charts!</p>}

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
            {user?.isLoggedIn && (
              <>
                <form onSubmit={handleSaveSounds} className="flex items-center">
                  <label htmlFor="chart-name" className="contents">
                    <span>Chart name</span>
                    <TextInput type="text" name="chart-name" placeholder="Enter chart name" />
                  </label>
                  <button
                    type="submit"
                    className="hover-blue p-2 rounded"
                  >
                    Save selected sounds
                  </button>
                </form>

                <button
                  type="button"
                  className="hover-blue p-2 rounded"
                  onClick={handleSaveSounds}
                >
                  Load selected sounds
                </button>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-center justify-around space-y-8 sm:space-x-8 sm:space-y-0 md:space-x-0 md:space-y-8 mt-8">
            <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8 max-w-full sm:max-w-md md:max-w-full">
              <ConsonantTable editable />
              <VowelTable
                allHeights={allHeights}
                setAllHeights={setAllHeights}
                editable
              />
            </div>
            <DiacriticTable>
              Click a diacritic to select it, then click a sound to apply it.
            </DiacriticTable>
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

        <SonorityHierarchy />

        <Section heading="List of selected sounds" classes="bg-gradient-to-br from-red-100 to-yellow-100">
          <p className="mx-auto text-center mb-8">
            Hover a feature to see its definition.
          </p>
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
            Play sound audio files
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
