import { useContext } from 'react';
import { TableContext } from '../assets/ipaData';
import FeatureList from './FeatureList';

export default function NeighborInspector() {
  const { allSounds, neighbor } = useContext(TableContext);

  if (neighbor === null) return <p className="text-center">Hold shift and click a sound to contrast it with other sounds!</p>;

  return <FeatureList sounds={allSounds} contrastWith={neighbor} />;
}
