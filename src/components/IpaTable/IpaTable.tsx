import ConsonantTable from './ConsonantTable';
import DiacriticTable from './DiacriticTable';
import VowelTable from './VowelTable';

export default function IpaTable({ editable }: { editable: boolean }) {
  if (editable) {
    return (
      <div className="grid w-full grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <ConsonantTable editable />
        </div>
        <div className="lg:row-span-2">
          <DiacriticTable />
        </div>
        <div className="lg:col-span-3">
          <VowelTable editable />
        </div>
      </div>
    );
  }

  // not editable, i.e. display
  return (
    <div>
      <div>
        <ConsonantTable editable={false} />
      </div>
      <div className="mt-8">
        <VowelTable editable={false} />
      </div>
    </div>
  );
}
