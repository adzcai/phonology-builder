import { useState } from 'react';
import styles from './IpaTable.module.css';
import { places, manners } from '../assets/ipaData';
import MannerRow from './MannerRow';

export default function IpaTable() {
  const [columns, setColumns] = useState(places.map((place) => ({ ...place, colSpan: 1 })));
  const [rows, setRows] = useState(manners.map((manner) => ({ ...manner, rowSpan: 1 })));

  return (
    <div>
      <table className={styles['ipa-chart']}>
        <thead>
          <tr>
            <th />
            {columns.map((col) => (
              <th
                key={col.name}
                colSpan={col.colSpan}
              >
                {col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {manners.map((manner) => (
            <MannerRow
              manner={manner}
              columns={columns}
              key={manner.name}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
