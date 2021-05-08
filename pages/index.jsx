import Head from 'next/head';
import IpaTable from '../src/components/IpaTable';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Phonology Creator</title>
      </Head>
      <IpaTable />
    </div>
  );
}
