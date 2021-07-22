import React, { useContext } from 'react';
import FeatureList from '../src/components/IpaTable/FeatureList';
import ConsonantTable from '../src/components/IpaTable/ConsonantTable';
import VowelTable from '../src/components/IpaTable/VowelTable';
import { TableContext, HeightsContext } from '../src/lib/client/context';

export default function ViewInventoryPage() {
  const { selectedSounds } = useContext(TableContext);
  const { allHeights, setAllHeights } = useContext(HeightsContext);

  if (selectedSounds.length === 0) return <p className="text-center">Begin selecting symbols to view a display chart!</p>;

  return (
    <>
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
    </>
  );
}
