import { Dispatch, SetStateAction, useContext } from 'react';
import {
  allSounds, Manner, matchFeatures, Place, Sound, SoundContext,
} from '../../../assets/ipaData';

type TableCellProps = {
  place: Place;
  manner: Manner;
  last: boolean;
  lastRow: boolean;
  editable: boolean;
};

function TableCell({
  place, manner, last, lastRow, editable,
}: TableCellProps) {
  const sounds = matchFeatures(allSounds, place.features, manner.features, { syllabic: false });
  const {
    sounds: selectedSounds, setSounds, neighbor, setNeighbor,
  } = useContext(SoundContext);

  return (
    <td className={`border-gray-300 border-l-2 ${!last && 'border-r-2'} border-t-2 ${!lastRow && 'border-b-2'} px-2 py-0 m-0`}>
      <div className="flex items-center justify-around">
        {
          (editable
            ? sounds : sounds.filter((sound) => selectedSounds.includes(sound))).map((sound) => (
              <button
                key={sound.name}
                type="button"
                className={`${selectedSounds.includes(sound) ? 'bg-green-300 hover:bg-red-300' : 'bg-blue-300 hover:bg-blue-500'} px-1 w-8 focus:outline-none`}
                onClick={() => {
                  setSounds((prev: Sound[]) => (
                    prev.includes(sound) ? prev.filter((s) => s !== sound) : [...prev, sound]
                  ));
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  if (sound === neighbor) setNeighbor(null);
                  else setNeighbor(sound);
                }}
              >
                {sound.name}
              </button>
          ))
}
      </div>
    </td>
  );
}

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
          place={place}
          manner={manner}
          editable={editable}
        />
      ))}
    </tr>
  );
}
