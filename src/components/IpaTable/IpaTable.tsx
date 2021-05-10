import { Dispatch, SetStateAction, useContext } from 'react';
import {
  Manner, Place, SoundContext,
} from '../../assets/ipaData';
import ConsonantTable from './ConsonantTable';

type Props = {
  rows: Manner[];
  setRows: Dispatch<SetStateAction<Manner[]>>;
  cols: Place[];
  setCols: Dispatch<SetStateAction<Place[]>>;
  editable: boolean;
};

export default function IpaTable({
  rows, setRows, cols, setCols, editable,
}: Props) {
  const { setSounds } = useContext(SoundContext);
  return (
    <div>
      {editable && (
      <div className="flex items-center justify-center py-4">
        <button
          type="button"
          className="px-2 py-2 bg-blue-300 hover:bg-blue-500 rounded"
          onClick={() => setSounds([])}
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
        editable={editable}
      />
    </div>
  );
}
