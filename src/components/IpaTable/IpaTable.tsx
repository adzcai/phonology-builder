import { Dispatch, SetStateAction } from 'react';
import {
  Manner, Place, Sound, SoundHook,
} from '../../assets/ipaData';
import ConsonantTable from './ConsonantTable';

type Props = {
  selectedSounds: Sound[];
  setSelectedSounds: SoundHook;
  setSoundsToCompare: SoundHook;

  rows: Manner[];
  setRows: Dispatch<SetStateAction<Manner[]>>;
  cols: Place[];
  setCols: Dispatch<SetStateAction<Place[]>>;
  editable: boolean;
};

export default function IpaTable({
  rows, setRows, cols, setCols, selectedSounds, setSelectedSounds, setSoundsToCompare, editable,
}: Props) {
  return (
    <div>
      {editable && (
      <div className="flex items-center justify-center py-4">
        <button
          type="button"
          className="px-2 py-2 bg-blue-300 hover:bg-blue-500 rounded"
          onClick={() => setSelectedSounds([])}
        >
          Clear
        </button>
      </div>
      )}
      <ConsonantTable
        rows={rows}
        setRows={setRows}
        cols={cols}
        setCols={setCols}
        selectedSounds={selectedSounds}
        setSelectedSounds={setSelectedSounds}
        setSoundsToCompare={setSoundsToCompare}
        editable={editable}
      />
    </div>
  );
}
