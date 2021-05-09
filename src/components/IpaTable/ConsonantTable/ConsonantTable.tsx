import { FC, useState } from 'react';
import styles from './ConsonantTable.module.css';
import {
  places, manners, Column, Row, Sound, SoundHook,
} from '../../../assets/ipaData';
import MannerRow from './MannerRow';

type Props = {
  setSelectedSounds: SoundHook,
  setSoundsToCompare: SoundHook
}

const ConsonantTable: FC<Props> = ({ setSelectedSounds, setSoundsToCompare }) => {
  const [columns, setColumns] = useState<Column[]>(places.map((place) => ({ ...place, colSpan: 1 })));
  const [rows, setRows] = useState<Row[]>(manners.map((manner) => ({ ...manner, rowSpan: 1 })));

  return (
    <table className={styles['ipa-chart']}>
      {/* ===== HEADER ===== */}
      <thead>
        <tr>
          <th />
          {/* only show a column if there is a selected sound in that column */}
          {columns.map((col) => (
            <th
              key={col.name}
              colSpan={col.colSpan}
            >
              {col.name}
              {/* Button to remove a column */}
              <button
                type="button"
                onClick={() => setColumns((prev) => prev.filter((c) => c.name !== col.name))}
              >
                -
              </button>
            </th>
          ))}
        </tr>
      </thead>
      {/* ===== BODY ===== */}
      <tbody>
        {rows.map((manner) => (
          <MannerRow
            key={manner.name}
            manner={manner}
            columns={columns}
            setRows={setRows}
            setSelectedSounds={setSelectedSounds}
            setSoundsToCompare={setSoundsToCompare}
          />
        ))}
      </tbody>
    </table>
  );
};

export default ConsonantTable;
