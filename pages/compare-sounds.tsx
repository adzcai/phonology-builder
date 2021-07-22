import { useContext } from 'react';
import FeatureList from '../src/components/IpaTable/FeatureList';
import { TableContext } from '../src/lib/client/context';

export default function CompareSoundsPage() {
  const { allSounds, neighbor } = useContext(TableContext);

  if (neighbor === null) {
    return (
      <p className="text-center">Hold shift and click a sound to contrast it with other sounds!</p>
    );
  }

  return <FeatureList sounds={allSounds} contrastWith={neighbor} />;
}
