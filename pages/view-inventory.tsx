import React, { useContext } from 'react';
import FeatureList from '../src/components/FeatureList';
import ConsonantTable from '../src/components/IpaTable/ConsonantTable';
import VowelTable from '../src/components/IpaTable/VowelTable';
import Layout from '../src/components/Layout';
import { TableContext, HeightsContext } from '../src/lib/context';

export default function ViewInventoryPage() {
  const { selectedSounds } = useContext(TableContext);
  const { allHeights, setAllHeights } = useContext(HeightsContext);

  if (selectedSounds.length === 0) return <Layout><p className="text-center">Begin selecting symbols to view a display chart!</p></Layout>;

  return (
    <Layout>
      <ConsonantTable editable={false} />
      <VowelTable
        allHeights={allHeights}
        setAllHeights={setAllHeights}
        editable={false}
      />

      <p className="mx-auto text-center mb-8">
        Hover a feature to see its definition.
      </p>

      <FeatureList sounds={selectedSounds} />
    </Layout>
  );
}
