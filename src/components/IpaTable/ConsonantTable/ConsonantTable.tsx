import { ConsonantTableProps } from '../../../assets/props';
import TableContainer from '../../TableContainer';
import MannerRow from './MannerRow';

export default function ConsonantTable({
  manners, setManners, places, setPlaces, editable,
}: ConsonantTableProps) {
  return (
    <TableContainer>
      <thead>
        <tr>
          <td className="border-gray-300 border-b-2 border-r-4 sticky left-0 bg-gradient-to-r from-white via-white to-transparent" />
          {editable && (
            <td className="border-gray-300 border-b-2 border-r-2" />
          )}
          {/* only show a column if there is a selected sound in that column */}
          {places.map((col, i) => (
            <th
              key={col.name}
              className={`border-gray-300 border-l-2 ${i < places.length - 1 && 'border-r-2'} border-b-2 px-2`}
            >
              <div className="flex items-center justify-center">
                {col.name}
                {/* Button to remove a column */}
                {editable && (
                  <button
                    type="button"
                    onClick={() => setPlaces((prev) => prev.filter((c) => c.name !== col.name))}
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
      <tbody>
        {manners.map((manner, i) => (
          <MannerRow
            key={manner.name}
            manner={manner}
            columns={places}
            setRows={setManners}
            last={i === manners.length - 1}
            editable={editable}
          />
        ))}
      </tbody>
    </TableContainer>
  );
}
