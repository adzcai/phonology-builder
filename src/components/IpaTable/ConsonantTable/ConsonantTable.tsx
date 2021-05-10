import { Dispatch, SetStateAction } from 'react';
import {
  SoundHook, Sound, Manner, Place,
} from '../../../assets/ipaData';
import MannerRow from './MannerRow';

type Props = {
  selectedSounds: Sound[];
  setSelectedSounds: SoundHook,
  setSoundsToCompare: SoundHook

  rows: Manner[];
  setRows: Dispatch<SetStateAction<Manner[]>>;
  cols: Place[];
  setCols: Dispatch<SetStateAction<Place[]>>;

  editable: boolean;
};

export default function ConsonantTable({
  selectedSounds, setSelectedSounds, setSoundsToCompare, rows, setRows, cols, setCols, editable,
}: Props) {
  return (
    <div className="max-w-2xl overflow-x-auto mx-auto border-black border-4 border-dashed rounded-xl">
      <table className="w-full whitespace-nowrap border-separate" style={{ borderSpacing: 0 }}>
        {/* ===== HEADER ===== */}
        <thead>
          <tr>
            <td className="border-gray-300 border-b-2 border-r-4 sticky left-0 bg-gradient-to-r from-white to-transparent" />
            {editable && (
            <td className="border-gray-300 border-b-2 border-r-2" />
            )}
            {/* only show a column if there is a selected sound in that column */}
            {cols.map((col, i) => (
              <th
                key={col.name}
                className={`border-gray-300 border-l-2 ${i < cols.length - 1 && 'border-r-2'} border-b-2 px-2`}
              >
                <div className="flex items-center justify-center">
                  {col.name}
                  {/* Button to remove a column */}
                  {editable && (
                  <button
                    type="button"
                    onClick={() => setCols((prev) => prev.filter((c) => c.name !== col.name))}
                    className="text-xs rounded bg-blue-300 hover:bg-blue-500 px-1 ml-2"
                  >
                    -
                  </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        {/* ===== BODY ===== */}
        <tbody>
          {rows.map((manner, i) => (
            <MannerRow
              key={manner.name}
              manner={manner}
              columns={cols}
              setRows={setRows}
              selectedSounds={selectedSounds}
              setSelectedSounds={setSelectedSounds}
              setSoundsToCompare={setSoundsToCompare}
              last={i === rows.length - 1}
              editable={editable}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
