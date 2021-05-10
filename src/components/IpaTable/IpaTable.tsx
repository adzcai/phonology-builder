import {
  Dispatch, SetStateAction, useContext,
} from 'react';
import {
  Manner, Place, TableContext,
} from '../../assets/ipaData';
import ConsonantTable from './ConsonantTable';
import DiacriticTable from './DiacriticTable';
import VowelTable from './VowelTable';

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
  const { setSounds } = useContext(TableContext);

  return (
    <div className="w-full">
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 w-full">
        <div className="lg:col-span-3">
          <ConsonantTable
            rows={rows}
            setRows={setRows}
            cols={cols}
            setCols={setCols}
            editable={editable}
          />
        </div>
        <div className="lg:row-span-2">
          <DiacriticTable />
        </div>
        <div className="lg:col-span-3">
          <VowelTable />
        </div>
      </div>
    </div>
  );
}
