import Head from 'next/head';
import { useEffect, useState } from 'react';
import {
  Sound, manners, matchFeatures, places, Manner, Place, TableContext, Diacritic, rawSounds,
} from '../src/assets/ipaData';
import IpaTable from '../src/components/IpaTable/IpaTable';
import FeatureList from '../src/components/FeatureList';
import NeighborInspector from '../src/components/NeighborInspector';

export default function Home() {
  // e.g. {a: true, b: false, c: false}
  const [allSounds, setAllSounds] = useState<Sound[]>(rawSounds);
  const [selectedSounds, setSelectedSounds] = useState<Sound[]>([]);
  const [neighbor, setNeighbor] = useState<Sound | null>(null);
  const [diacritic, setDiacritic] = useState<Diacritic | null>(null);

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
    <div className="px-4">
      <Head>
        <title>Phonology Creator</title>
      </Head>
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
      </TableContext.Provider>
    </div>
  );
}
