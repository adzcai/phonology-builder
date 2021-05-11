import { useContext } from 'react';
import {
  Condition, matchFeatures, Sound, TableContext, Diacritic,
} from '../assets/ipaData';

type TableCellProps = {
  features: Condition;
  last: boolean;
  lastRow: boolean;
  editable: boolean;
  areBordersCollapsed?: boolean;
  insertBelow: (toAdd: Diacritic) => void;
};

function canApplyDiacriticToSound(diacritic, sound) {
  // can't apply diacritics if they have no effect
  return matchFeatures([sound], diacritic.requirements).length > 0
          && matchFeatures([sound], diacritic.features).length === 0;
}

export default function TableCell({
  features, last, lastRow, editable, areBordersCollapsed = false, insertBelow,
}: TableCellProps) {
  const {
    allSounds, setAllSounds,
    sounds: selectedSounds, setSounds,
    neighbor, setNeighbor,
    diacritic, setDiacritic,
  } = useContext(TableContext);

  let sounds = matchFeatures(allSounds, features);
  if (!editable) sounds = sounds.filter((sound) => selectedSounds.includes(sound));

  let className: (s: Sound) => string;
  let handleClick: (e: MouseEvent, s: Sound) => void;
  if (diacritic !== null) {
    className = (sound) => (
      canApplyDiacriticToSound(diacritic, sound) ? 'bg-blue-300 hover:bg-green-300' : 'bg-yellow-300 hover:bg-yellow-500');

    handleClick = (e, sound) => {
      if (!canApplyDiacriticToSound(diacritic, sound)) {
        setDiacritic(null);
        return;
      }

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
    // no diacritic is selected, plain click
    className = (sound) => (selectedSounds.includes(sound)
      ? 'bg-green-300 hover:bg-red-500' : 'bg-blue-300 hover:bg-blue-500');

    handleClick = (e, sound) => {
      // shift key: toggle neighbor
      // alt key: remove from all sounds
      // regular click: toggle sound selected
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
            onClick={(e) => handleClick(e as unknown as MouseEvent, sound)}
          >
            {sound.name}
          </button>
        ))}
      </div>
    </td>
  );
}
