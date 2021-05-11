import React, {
  ChangeEventHandler, useState,
} from 'react';
import {
  allFeatures, matchFeatures, rawSounds, toggleInArray, Diacritic, TableContext,
  canApplyDiacriticsToSound, applyDiacriticsToSound,
} from '../assets/ipaData';
import ConsonantTable from './IpaTable/ConsonantTable';
import VowelTable from './IpaTable/VowelTable';
import DiacriticTable from './IpaTable/DiacriticTable';

type InputValue = 'true' | 'false' | '0';

type SelectorRowProps = {
  selected: string;
  setSelected: ChangeEventHandler<HTMLSelectElement>;
  val: InputValue;
  setVal: (_: InputValue) => void;
  removeFeature: () => void;
  features: string[][];
};

function SelectorRow({
  selected, setSelected, val, setVal, removeFeature, features,
}: SelectorRowProps) {
  return (
    <li className="border-gray-300 border-4 w-max ">
      <select value={selected} onChange={setSelected}>
        {[[''], ...allFeatures].map(([featureName]) => (
          <option
            value={featureName}
            disabled={features.some((feature) => feature[0] === featureName)}
          >
            {featureName}
          </option>
        ))}
      </select>
      <button type="button" className="px-2 rounded bg-blue-300 hover:bg-red-300" onClick={removeFeature}>-</button>
      <div>
        {['true', 'false', '0'].map((v) => (
          <label>
            {v}
            <input
              type="radio"
              name={`${selected}-val`}
              value={v}
              checked={val === v}
              onChange={(e) => setVal(e.target.value as InputValue)}
              className="mx-2"
            />
          </label>
        ))}
      </div>
    </li>
  );
}

export default function FilterFeatures() {
  const [features, setFeatures] = useState<[string, InputValue][]>([]);
  const [selectedDiacritics, setSelectedDiacritics] = useState<Diacritic[]>([]);

  const validFeatures = features.filter((feature) => feature[0] !== '' && feature[1] !== null);

  const selectedSounds = validFeatures.length === 0 ? [] : matchFeatures(
    [
      ...rawSounds,
      ...selectedDiacritics
        .flatMap((diacritic) => rawSounds
          .filter((sound) => canApplyDiacriticsToSound([diacritic], sound))
          .map((sound) => applyDiacriticsToSound(sound, diacritic))),
    ], validFeatures.map(([name, val]) => ({ [name]: JSON.parse(val) })),
  );

  const handleDiacriticClick = (diacritic) => setSelectedDiacritics(
    toggleInArray(selectedDiacritics, diacritic),
  );

  return (
    <div>
      <ul>
        {features.map(([selected, val], i) => (
          <SelectorRow
            key={selected}
            selected={selected}
            setSelected={(e) => setFeatures([
              ...features.slice(0, i),
              [e.target.value, val],
              ...features.slice(i + 1),
            ])}
            val={val}
            setVal={(v) => {
              setFeatures([
                ...features.slice(0, i),
                [selected, v],
                ...features.slice(i + 1),
              ]);
            }}
            features={features}
            removeFeature={
              () => setFeatures(features.filter((feature) => feature[0] !== selected))
            }
          />
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setFeatures((prev) => [...prev, ['', null]])}
        className="bg-blue-300 p-2 rounded"
      >
        Filter by new feature
      </button>
      <TableContext.Provider value={{
        selectedDiacritics,
        setSelectedDiacritics,
        selectedSounds,
        handleDiacriticClick,
      }}
      >
        <div>
          <ConsonantTable editable={false} />
        </div>
        <div className="mt-8">
          <DiacriticTable />
        </div>
        <div className="mt-8">
          <VowelTable editable={false} />
        </div>
      </TableContext.Provider>
    </div>
  );
}
