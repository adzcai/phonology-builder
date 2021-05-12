import { PropsWithChildren, useContext } from 'react';
import { allDiacritics, TableContext } from '../../assets/ipaData';

// This table will only exist if the parent IpaTable is editable
export default function DiacriticTable({ children }: PropsWithChildren<{}>) {
  const {
    selectedDiacritics, handleDiacriticClick,
  } = useContext(TableContext);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full space-y-8">
      <p className="bg-pink-300 text-center rounded-xl p-4">{children}</p>
      <div className="flex flex-row justify-center flex-wrap">
        {allDiacritics.map((diacritic) => (
          <button
            key={diacritic.displayName}
            type="button"
            className={`
              ${selectedDiacritics.includes(diacritic) ? 'bg-green-300 hover:bg-red-300' : 'hover-blue'}
              focus:outline-none w-10 border-white border-8 m-1 rounded-lg
              text-2xl flex items-center justify-center`}
            onClick={() => handleDiacriticClick(diacritic)}
            title={diacritic.displayName}
          >
            {diacritic.name}
          </button>
        ))}
      </div>
    </div>
  );
}
