import { Dispatch, SetStateAction } from 'react';
import {
  Manner, Place,
} from '../../../assets/ipaData';
import TableContainer from '../../TableContainer';
import MannerRow from './MannerRow';

type Props = {
  rows: Manner[];
  setRows: Dispatch<SetStateAction<Manner[]>>;
  cols: Place[];
  setCols: Dispatch<SetStateAction<Place[]>>;

  editable: boolean;
};

export default function ConsonantTable({
  rows, setRows, cols, setCols, editable,
}: Props) {
  return (
    <TableContainer>
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
            last={i === rows.length - 1}
            editable={editable}
          />
        ))}
      </tbody>
    </TableContainer>
  );
}
