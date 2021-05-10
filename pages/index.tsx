import Head from 'next/head';
import { useEffect, useState } from 'react';
import {
  Sound, manners, matchFeatures, places, Manner, Place, SoundContext,
} from '../src/assets/ipaData';
import IpaTable from '../src/components/IpaTable/IpaTable';
import FeatureList from '../src/components/FeatureList';

export default function Home() {
  // e.g. {a: true, b: false, c: false}
  const [selectedSounds, setSelectedSounds] = useState<Sound[]>([]);

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
      <SoundContext.Provider value={{ sounds: selectedSounds, setSounds: setSelectedSounds }}>
        <div style={{ padding: '2rem 0' }}>
          <IpaTable
            rows={mainRows}
            setRows={setMainRows}
            cols={mainCols}
            setCols={setMainCols}
            editable
          />
        </div>
        <div className="mt-4 mb-12">
          { selectedSounds.length > 0 ? (
            <IpaTable
              rows={displayRows}
              setRows={setDisplayRows}
              cols={displayCols}
              setCols={setDisplayCols}
              editable={false}
            />
          ) : <p className="text-center">Begin selecting symbols to view a display chart!</p>}
        </div>
        <FeatureList />
      </SoundContext.Provider>
    </div>
  );
}
