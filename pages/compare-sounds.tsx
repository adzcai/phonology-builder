import { useContext } from 'react';
import FeatureList from '../src/components/IpaTable/FeatureList';
import { GlobalContext } from '../src/lib/client/context';

export default function CompareSoundsPage() {
  const { allSounds, neighbor } = useContext(GlobalContext);

  if (neighbor === null) {
    return (
      <p className="text-center">Hold shift and click a sound to contrast it with other sounds!</p>
    );
  }

  return <FeatureList sounds={allSounds} contrastWith={neighbor} />;
}
