import Head from 'next/head';
import { useEffect, useState } from 'react';
import {
  Sound, manners, matchFeatures, places, Manner, Place, SoundContext, allFeatures,
} from '../src/assets/ipaData';
import IpaTable from '../src/components/IpaTable/IpaTable';
import FeatureList from '../src/components/FeatureList';
import NeighborInspector from '../src/components/NeighborInspector';

export default function Home() {
  // e.g. {a: true, b: false, c: false}
  const [selectedSounds, setSelectedSounds] = useState<Sound[]>([]);
  const [neighbor, setNeighbor] = useState<Sound | null>(null);

  const [mainRows, setMainRows] = useState<Manner[]>(manners);
  const [mainCols, setMainCols] = useState<Place[]>(places);
  const [displayRows, setDisplayRows] = useState<Manner[]>([]);
  const [displayCols, setDisplayCols] = useState<Place[]>([]);

  useEffect(() => {
    setDisplayRows(manners.filter(
      (manner) => matchFeatures(selectedSounds, manner.features).length,
    ));
    setDisplayCols(places.filter(
      (place) => matchFeatures(selectedSounds, place.features).length,
    ));
  }, [selectedSounds]);

  return (
    <div>
      <Head>
        <title>Phonology Creator</title>
      </Head>
      <SoundContext.Provider value={{
        sounds: selectedSounds, setSounds: setSelectedSounds, neighbor, setNeighbor,
      }}
      >
        <section className="my-8">
          <IpaTable
            rows={mainRows}
            setRows={setMainRows}
            cols={mainCols}
            setCols={setMainCols}
            editable
          />
        </section>
        <section className="my-8">
          { selectedSounds.length > 0 ? (
            <IpaTable
              rows={displayRows}
              setRows={setDisplayRows}
              cols={displayCols}
              setCols={setDisplayCols}
              editable={false}
            />
          ) : <p className="text-center">Begin selecting symbols to view a display chart!</p>}
        </section>
        <section className="my-8">
          <FeatureList sounds={selectedSounds} />
        </section>
        <section className="my-8">
          <NeighborInspector />
        </section>
      </SoundContext.Provider>
    </div>
  );
}
