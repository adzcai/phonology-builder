import Head from 'next/head';
import {
  PropsWithChildren, useCallback, useEffect, useState,
} from 'react';
import {
  Sound, allManners, matchFeatures, allPlaces, Manner, Place, TableContext, Diacritic, rawSounds,
  Frontness, Height, allFrontnesses, allHeights,
} from '../src/assets/ipaData';
import IpaTable from '../src/components/IpaTable/IpaTable';
import FeatureList from '../src/components/FeatureList';
import NeighborInspector from '../src/components/NeighborInspector';

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
  const [diacritic, setDiacritic] = useState<Diacritic | null>(null);

  const [manners, setManners] = useState<Manner[]>(allManners);
  const [places, setPlaces] = useState<Place[]>(allPlaces);
  const [heights, setHeights] = useState<Height[]>(allHeights);
  const [frontnesses, setFrontnesses] = useState<Frontness[]>(allFrontnesses);

  const [displayManners, setDisplayManners] = useState<Manner[]>([]);
  const [displayPlaces, setDisplayPlaces] = useState<Place[]>([]);
  const [displayHeights, setDisplayHeights] = useState<Height[]>([]);
  const [displayFrontnesses, setDisplayFrontnesses] = useState<Frontness[]>([]);

  const resetAll = useCallback(() => {
    setAllSounds(rawSounds);
    setSelectedSounds([]);
    setNeighbor(null);
    setDiacritic(null);
    setManners(allManners);
    setPlaces(allPlaces);
    setHeights(allHeights);
    setFrontnesses(allFrontnesses);
  }, []);

  useEffect(() => {
    console.log(selectedSounds);
    setDisplayManners(manners.filter(
      (manner) => matchFeatures(selectedSounds, manner.features, { syllabic: false }).length,
    ));
    setDisplayPlaces(places.filter(
      (place) => matchFeatures(selectedSounds, place.features, { syllabic: false }).length,
    ));
    setDisplayHeights(heights.filter(
      (height) => matchFeatures(selectedSounds, height.features, { syllabic: true }).length,
    ));
    setDisplayFrontnesses(frontnesses.filter(
      (frontness) => matchFeatures(selectedSounds, frontness.features, { syllabic: true }).length,
    ));
  }, [manners, places, heights, frontnesses, selectedSounds]);

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
        sounds: selectedSounds,
        setSounds: setSelectedSounds,
        neighbor,
        setNeighbor,
        diacritic,
        setDiacritic,
      }}
      >
        <Section heading="Choose sounds" classes="bg-gradient-to-br from-red-100 to-yellow-100">
          <IpaTable
            {...{
              manners,
              setManners,
              places,
              setPlaces,
              heights,
              setHeights,
              frontnesses,
              setFrontnesses,
            }}
            editable
          />
        </Section>
        <Section heading="Phonetic inventory" classes="bg-gradient-to-bl from-blue-100 to-green-100">
          {selectedSounds.length > 0 ? (
            <IpaTable
              manners={displayManners}
              setManners={setDisplayManners}
              places={displayPlaces}
              setPlaces={setDisplayPlaces}
              heights={displayHeights}
              setHeights={setDisplayHeights}
              frontnesses={displayFrontnesses}
              setFrontnesses={setDisplayFrontnesses}
              editable={false}
            />
          ) : <p className="text-center">Begin selecting symbols to view a display chart!</p>}
        </Section>
        <Section heading="List of selected sounds" classes="bg-gradient-to-br from-red-100 to-yellow-100">
          <FeatureList sounds={selectedSounds} />
        </Section>
        <Section heading="Compare sound with neighbors" classes="py-8 bg-purple-200">
          <NeighborInspector />
        </Section>
      </TableContext.Provider>
      <footer className="text-center py-2">Made by Alexander Cai (c) May 2021</footer>
    </div>
  );
}
