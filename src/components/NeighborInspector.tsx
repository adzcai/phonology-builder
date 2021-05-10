import { useContext } from 'react';
import { allSounds, SoundContext } from '../assets/ipaData';
import FeatureList from './FeatureList';

export default function NeighborInspector() {
  const { neighbor } = useContext(SoundContext);

  if (neighbor === null) return <p className="text-center">Right click a sound to contrast it with other sounds!</p>;

  return <FeatureList sounds={allSounds} contrastWith={neighbor} />;
}
