import { Dispatch, SetStateAction } from 'react';
import {
  Manner, Place,
} from '../../../assets/ipaData';
import TableCell from '../../TableCell';

type MannerRowProps = {
  manner: Manner;
  columns: Place[];
  setRows: Dispatch<SetStateAction<Manner[]>>;
  last: boolean;
  editable: boolean;
};

export default function MannerRow({
  manner, columns, setRows, last, editable,
}: MannerRowProps) {
  return (
    <tr key={manner.name} className="p-0 m-0">
      {/* head of row */}
      <th className={`border-gray-300 border-t-2 ${!last && 'border-b-2'} border-r-4 sticky left-0 bg-gradient-to-r from-white to-transparent px-2 py-0 m-0`}>
        {manner.name}
      </th>
      {editable && (
      <th
        className={`border-gray-300 border-t-2 ${!last && 'border-b-2'} border-r-2 px-1 py-0 m-0 bg-blue-300 hover:bg-blue-500 cursor-pointer`}
        onClick={() => setRows((prev) => prev.filter((row) => row.name !== manner.name))}
        role="button"
      >
        -
      </th>
      )}
      {/* elements / sounds */}
      {columns.map((place, i) => (
        <TableCell
          key={place.name}
          last={i === columns.length - 1}
          lastRow={last}
          features={[place.features, manner.features, { syllabic: false }]}
          editable={editable}
        />
      ))}
    </tr>
  );
}
