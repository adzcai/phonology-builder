import { Dispatch, SetStateAction, useContext } from 'react';
import {
  Manner,
  matchFeatures, Sound, TableContext,
} from '../assets/ipaData';

type TableCellProps = {
  features: Partial<Sound>[];
  last: boolean;
  lastRow: boolean;
  editable: boolean;
  areBordersCollapsed?: boolean;
  insertBelow: (toAdd: Manner) => void;
};

export default function TableCell({
  features, last, lastRow, editable, areBordersCollapsed = false, insertBelow,
}: TableCellProps) {
  const {
    allSounds, setAllSounds,
    sounds: selectedSounds, setSounds,
    neighbor, setNeighbor,
    diacritic, setDiacritic,
  } = useContext(TableContext);

  let sounds = matchFeatures(allSounds, ...features);
  if (!editable) sounds = sounds.filter((sound) => selectedSounds.includes(sound));

  let className; let
    handleClick;
  if (diacritic !== null) {
    className = (sound) => (
      matchFeatures([sound], diacritic.requirements).length > 0
      && matchFeatures([sound], diacritic.features).length === 0
        ? 'bg-blue-300 hover:bg-green-300' : 'bg-yellow-300 hover:bg-yellow-500');
    handleClick = (e: MouseEvent, sound: Sound) => {
      const newSound: Sound = { ...sound };
      newSound.name += diacritic.name;
      Object.keys(diacritic.features).forEach((feature) => {
        newSound[feature] = diacritic.features[feature];
      });

      setAllSounds((prev) => [...prev, newSound]);
      insertBelow(diacritic);
      setDiacritic(null);
    };
  } else {
    className = (sound) => (selectedSounds.includes(sound)
      ? 'bg-green-300 hover:bg-red-300' : 'bg-blue-300 hover:bg-blue-500');
    handleClick = (e: MouseEvent, sound) => {
      if (e.shiftKey) {
        if (sound === neighbor) setNeighbor(null);
        else setNeighbor(sound);
      } else if (e.altKey) {
        setAllSounds((prev) => prev.filter((s) => s !== sound));
      } else {
        setSounds((prev: Sound[]) => (
          prev.includes(sound) ? prev.filter((s) => s !== sound) : [...prev, sound]
        ));
      }
    };
  }

  const borderClassName = areBordersCollapsed
    ? 'border-t-4 border-l-4'
    : `border-l-2 ${!last && 'border-r-2'} border-t-2 ${!lastRow && 'border-b-2'}`;

  return (
    <td
      className={`border-gray-300 ${borderClassName}`}
    >
      <div className="flex items-center justify-around">
        {/* unvoiced on left, voiced on right */}
        {[...sounds].sort((a) => (a.voice ? 1 : -1)).map((sound) => (
          <button
            key={sound.name}
            type="button"
            className={`${className(sound)} px-1 w-8 focus:outline-none font-serif`}
            onClick={(e) => handleClick(e, sound)}
          >
            {sound.name}
          </button>
        ))}
      </div>
    </td>
  );
}
