import { FC } from 'react';
import { SoundHook } from '../../assets/ipaData';
import ConsonantTable from './ConsonantTable';
import styles from './IpaTable.module.css';

type Props = {
  setSelectedSounds: SoundHook;
  setSoundsToCompare: SoundHook;
};

const IpaTable: FC<Props> = ({ setSelectedSounds, setSoundsToCompare }) => (
  <div className={styles['chart-container']}>
    <div>
      <ConsonantTable
        setSelectedSounds={setSelectedSounds}
        setSoundsToCompare={setSoundsToCompare}
      />
    </div>
  </div>
);

export default IpaTable;
