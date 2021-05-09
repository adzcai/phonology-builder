import Head from 'next/head';
import { useState } from 'react';
import { Sound } from '../src/assets/ipaData';
import IpaTable from '../src/components/IpaTable/IpaTable';
import DisplayIpaTable from '../src/components/DisplayIpaTable';
import FeatureList from '../src/components/FeatureList';

export default function Home() {
  // e.g. {a: true, b: false, c: false}
  const [selectedSounds, setSelectedSounds] = useState<Sound[]>([]);
  const [soundsToCompare, setSoundsToCompare] = useState<Sound[]>([]);

  return (
    <div>
      <Head>
        <title>Phonology Creator</title>
      </Head>
      <div>
        <FeatureList sounds={soundsToCompare} />
      </div>
      <div style={{ padding: '2rem 0' }}>
        <IpaTable setSelectedSounds={setSelectedSounds} setSoundsToCompare={setSoundsToCompare} />
      </div>
      <div style={{ padding: '2rem 0' }}>
        <DisplayIpaTable selectedSounds={selectedSounds} />
      </div>
    </div>
  );
}
