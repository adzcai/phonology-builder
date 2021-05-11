import { Dispatch, SetStateAction, useCallback } from 'react';
import {
  Diacritic,
  Manner, Place,
} from '../../../assets/ipaData';
import TableCell from '../../TableCell';

type MannerRowProps = {
  manner: Manner;
  columns: Place[];
  manners: Manner[];
  setManners: Dispatch<SetStateAction<Manner[]>>;
  last: boolean;
  editable: boolean;
};

export default function MannerRow({
  manner, manners, columns, setManners, last, editable,
}: MannerRowProps) {
  const insertBelow = useCallback((diacritic: Diacritic) => {
    const index = manners.findIndex((a) => a === manner);
    setManners([
      ...manners.slice(0, index + 1),
      { name: `${diacritic.displayName} ${manner.name}`, features: { ...manner.features, ...diacritic.features } },
      ...manners.slice(index + 1)]);
  }, [manner, manners]);

  return (
    <tr key={manner.name}>
      {/* head of row */}
      <th
        className={`border-gray-300 border-t-2 ${!last && 'border-b-2'} border-r-4 sticky left-0
          bg-gradient-to-r from-white via-white to-transparent px-2`}
        title={JSON.stringify(manner.features)}
      >
        {manner.name.replace('lateral', 'lat.').replace('approximant', 'approx.')}
      </th>
      {editable && (
      <th
        className={`border-gray-300 border-t-2 ${!last && 'border-b-2'} border-r-2 px-1 bg-blue-300 hover:bg-blue-500 cursor-pointer`}
        onClick={() => setManners((prev) => prev.filter((row) => row.name !== manner.name))}
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
          insertBelow={insertBelow}
        />
      ))}
    </tr>
  );
}
