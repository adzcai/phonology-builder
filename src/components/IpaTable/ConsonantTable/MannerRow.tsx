import {
  allSounds, Column, Manner, manners, matchFeatures, places, Sound,
} from '../../../assets/ipaData';
import styles from './MannerRow.module.css';

type Props = {
  manner: Manner;
  columns: Column[];

  setRows: any;
  setSelectedSounds: any;
  setSoundsToCompare: any;
}

const TableCell = ({
  place, manner, setSelectedSounds, setSoundsToCompare,
}) => (
  <td colSpan={place.colSpan}>
    {matchFeatures(allSounds, place.features, manner.features, { syllabic: false })
      .map((sound) => (
        <button
          key={sound.name}
          type="button"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            margin: '0px 4px',
            padding: '0px',
            fontSize: '1em',
          }}
          onClick={() => {
            setSelectedSounds((prev: Sound[]) => (
              prev.includes(sound) ? prev.filter((s) => s !== sound) : [...prev, sound]
            ));
          }}
          onDoubleClick={() => {
            setSoundsToCompare((prev: Sound[]) => (
              prev.includes(sound) ? prev.filter((s) => s !== sound) : [...prev, sound]));
          }}
        >
          {sound.name}
        </button>
      ))}
  </td>
);

export default function MannerRow({
  manner, columns, setRows, setSelectedSounds, setSoundsToCompare,
}: Props) {
  return (
    <tr key={manner.name}>
      {/* head of row */}
      <th className={styles['row-header']}>
        {manner.name}
        <div className={styles['dropdown-container']}>
          {/* button to remove row */}
          <button
            type="button"
            onClick={() => setRows((prev) => prev.filter((row) => row.name !== manner.name))}
          >
            -
          </button>
        </div>
      </th>
      {/* elements / sounds */}
      {columns.map((place) => (
        <TableCell
          key={place.name}
          place={place}
          manner={manner}
          setSelectedSounds={setSelectedSounds}
          setSoundsToCompare={setSoundsToCompare}
        />
      ))}
    </tr>
  );
}
