import { IpaTableProps } from '../../assets/props';
import ConsonantTable from './ConsonantTable';
import DiacriticTable from './DiacriticTable';
import VowelTable from './VowelTable';

export default function IpaTable({
  manners, setManners, places, setPlaces,
  heights, setHeights, frontnesses, setFrontnesses, editable,
}: IpaTableProps) {
  if (editable) {
    return (
      <div className="grid w-full grid-cols-1 lg:grid-cols-4 gap-8">

        <div className="lg:col-span-3">
          <ConsonantTable
            manners={manners}
            setManners={setManners}
            places={places}
            setPlaces={setPlaces}
            editable
          />
        </div>
        <div className="lg:row-span-2">
          <DiacriticTable />
        </div>
        <div className="lg:col-span-3">
          <VowelTable
            heights={heights}
            setHeights={setHeights}
            frontnesses={frontnesses}
            setFrontnesses={setFrontnesses}
            editable
          />
        </div>
      </div>
    );
  }

  // not editable, i.e. display
  return (
    <div>
      {manners.length > 0 && (
      <div className="w-full">
        <ConsonantTable
          manners={manners}
          setManners={setManners}
          places={places}
          setPlaces={setPlaces}
          editable={editable}
        />
      </div>
      )}
      {heights.length > 0 && (
      <div className="w-full">
        <VowelTable
          heights={heights}
          setHeights={setHeights}
          frontnesses={frontnesses}
          setFrontnesses={setFrontnesses}
          editable={editable}
        />
      </div>
      )}
    </div>
  );
}
