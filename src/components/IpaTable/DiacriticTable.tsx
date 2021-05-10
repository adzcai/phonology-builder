import { useContext } from 'react';
import { diacritics, TableContext } from '../../assets/ipaData';

export default function DiacriticTable() {
  const {
    diacritic: selected, setDiacritic,
  } = useContext(TableContext);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex flex-row justify-center flex-wrap">
        {diacritics.map((diacritic) => (
          <button
            key={diacritic.displayName}
            type="button"
            className={`
              ${selected === diacritic ? 'bg-green-300 hover:bg-red-300' : 'bg-blue-300 hover:bg-blue-500'}
              focus:outline-none w-10 border-white border-8 m-1 rounded-lg
              text-2xl flex items-center justify-center`}
            onClick={() => setDiacritic(diacritic === selected ? null : diacritic)}
            title={diacritic.displayName}
          >
            {diacritic.name}
          </button>
        ))}
      </div>
    </div>
  );
}
