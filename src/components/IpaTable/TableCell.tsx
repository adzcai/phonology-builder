import { useContext } from 'react';
import {
  Sound, TableContext, Diacritic, applyDiacriticsToSound, canApplyDiacriticsToSound, allFeatures,
} from '../../assets/ipaData';

function sortSounds(a, b) {
  // eslint-disable-next-line no-restricted-syntax
  for (const [feature] of allFeatures) {
    if (a[feature] !== b[feature]) {
      if (a[feature] === true) return 1;
      if (a[feature] === false) return -1;
    }
  }
  return 1;
}

type TableCellProps = {
  sounds: Sound[];
  insertBelow?: (toAdd: Diacritic) => void;
  editable: boolean;
};

type SoundContainerProps = { sound: Sound };

export default function TableCell({
  sounds, insertBelow, editable,
}: TableCellProps) {
  const {
    setAllSounds,
    selectedSounds, setSelectedSounds: setSounds,
    neighbor, setNeighbor,
    selectedDiacritics, setSelectedDiacritics,
  } = useContext(TableContext);

  const baseStyles = 'px-1 lg:py-1 w-8 focus:outline-none font-serif text-center';
  let SoundContainer: (_: SoundContainerProps) => JSX.Element;

  if (!editable) {
    SoundContainer = ({ sound }: SoundContainerProps) => (
      <div className={baseStyles}>{sound.name}</div>
    );
  } else if (selectedDiacritics.length > 0) {
    SoundContainer = ({ sound }: SoundContainerProps) => (
      <button
        type="button"
        className={`${baseStyles} ${canApplyDiacriticsToSound(selectedDiacritics, sound) ? 'bg-blue-300 hover:bg-green-300' : 'bg-yellow-300 hover:bg-yellow-500'}`}
        onClick={() => {
          setSelectedDiacritics([]);

          if (canApplyDiacriticsToSound(selectedDiacritics, sound)) {
            setAllSounds((prev) => [...prev, applyDiacriticsToSound(sound, ...selectedDiacritics)]);
            insertBelow(selectedDiacritics[0]);
          }
        }}
      >
        {sound.name}
      </button>
    );
  } else {
    SoundContainer = ({ sound }: SoundContainerProps) => (
      <button
        type="button"
        className={`${baseStyles} ${selectedSounds.some((s) => s.name === sound.name)
          ? 'bg-green-300 hover:bg-red-500' : 'hover-blue'}`}
        onClick={(e) => {
          // shift key: toggle neighbor
          // alt key: remove from all sounds
          // regular click: toggle sound selected
          if (e.shiftKey) {
            if (sound === neighbor) setNeighbor(null);
            else setNeighbor(sound);
          } else if (e.altKey) {
            setAllSounds((prev) => prev.filter((s) => s.name !== sound.name));
          } else {
            setSounds((prev: Sound[]) => (
              prev.includes(sound) ? prev.filter((s) => s.name !== sound.name) : [...prev, sound]
            ));
          }
        }}
      >
        {sound.name}
      </button>
    );
  }

  return (
    <td className="border-gray">
      <div className="flex h-full w-full items-center justify-around">
        {/* unvoiced on left, voiced on right */}
        {[...sounds].sort(sortSounds).map((sound) => (
          // eslint-disable-next-line react/prop-types
          <SoundContainer key={sound.name} sound={sound} />
        ))}
      </div>
    </td>
  );
}
