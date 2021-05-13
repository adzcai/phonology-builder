import { useContext } from 'react';
import {
  Sound, TableContext, Diacritic, applyDiacriticsToSound, canApplyDiacriticsToSound,
} from '../../assets/ipaData';

type TableCellProps = {
  sounds: Sound[];
  collapseBorders?: boolean;
  insertBelow?: (toAdd: Diacritic) => void;
  editable: boolean;
};

type SoundContainerProps = { sound: Sound };

export default function TableCell({
  sounds, collapseBorders = false, insertBelow, editable,
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
    SoundContainer = ({ sound }: SoundContainerProps) => <div className={`${baseStyles} bg-blue-300`}>{sound.name}</div>;
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
        className={`${baseStyles} ${selectedSounds.includes(sound)
          ? 'bg-green-300 hover:bg-red-500' : 'hover-blue'}`}
        onClick={(e) => {
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
        }}
      >
        {sound.name}
      </button>
    );
  }

  return (
    <td className="border-gray">
      <div className="flex items-center justify-around">
        {/* unvoiced on left, voiced on right */}
        {[...sounds].sort((a) => (a.voice ? 1 : -1)).map((sound) => (
          // eslint-disable-next-line react/prop-types
          <SoundContainer key={sound.name} sound={sound} />
        ))}
      </div>
    </td>
  );
}
