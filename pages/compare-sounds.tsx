import { useContext } from 'react';
import { TableContext } from '../src/assets/ipa-data';
import FeatureList from '../src/components/FeatureList';
import Layout from '../src/components/Layout';

export default function CompareSoundsPage() {
  const { allSounds, neighbor } = useContext(TableContext);

  if (neighbor === null) {
    return (
      <Layout>
        <p className="text-center">Hold shift and click a sound to contrast it with other sounds!</p>
      </Layout>
    );
  }

  return <FeatureList sounds={allSounds} contrastWith={neighbor} />;
}
