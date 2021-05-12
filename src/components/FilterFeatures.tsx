import React, {
  ChangeEventHandler, useState,
} from 'react';
import {
  allFeatures, matchFeatures, allSounds, toggleInArray, Diacritic, TableContext,
  canApplyDiacriticsToSound, applyDiacriticsToSound, allHeights as rawHeights, Height,
} from '../assets/ipaData';
import ConsonantTable from './IpaTable/ConsonantTable';
import VowelTable from './IpaTable/VowelTable';
import DiacriticTable from './IpaTable/DiacriticTable';

type InputValue = '+' | '-' | '0';

type SelectorRowProps = {
  selected: string;
  setSelected: ChangeEventHandler<HTMLSelectElement>;
  val: InputValue;
  setVal: (_: InputValue) => void;
  removeFeature: () => void;
  features: string[][];
};

function getNextAvailableFeature(features: string[][]) {
  return allFeatures.find(([f]) => f !== 'name' && !features.some(([name]) => f === name))[0];
}

function SelectorRow({
  selected, setSelected, val, setVal, removeFeature, features,
}: SelectorRowProps) {
  return (
    <li className="border-gray-300 border-4 w-max bg-white rounded-xl p-2">
      <select value={selected} onChange={setSelected}>
        {[[''], ...allFeatures].map(([featureName]) => (
          <option
            key={featureName}
            value={featureName}
            disabled={features.some((feature) => feature[0] === featureName)}
          >
            {featureName}
          </option>
        ))}
      </select>
      <button type="button" className="px-2 rounded bg-red-200 hover:bg-red-500" onClick={removeFeature}>-</button>
      <div className="w-full flex justify-between">
        {['+', '-', '0'].map((v) => (
          <label key={v} htmlFor={`${selected}-val`}>
            {v}
            <input
              type="radio"
              id={`${selected}-val`}
              name={`${selected}-val`}
              value={v}
              checked={val === v}
              onChange={(e) => setVal(e.target.value as InputValue)}
              className="ml-1"
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
  const [allHeights, setAllHeights] = useState<Height[]>(rawHeights);

  const validFeatures = features.filter((feature) => feature[0] !== '' && feature[1] !== null);

  const selectedSounds = validFeatures.length === 0 ? [] : matchFeatures(
    [
      ...allSounds,
      ...selectedDiacritics
        .flatMap((diacritic) => allSounds
          .filter((sound) => canApplyDiacriticsToSound([diacritic], sound))
          .map((sound) => applyDiacriticsToSound(sound, diacritic))),
    ], validFeatures.map(([name, val]) => ({ [name]: ({ '+': true, '-': false, 0: 0 }[val]) })),
  );

  const handleDiacriticClick = (diacritic) => setSelectedDiacritics(
    toggleInArray(selectedDiacritics, diacritic),
  );

  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <ul className="flex flex-wrap">
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
          onClick={() => setFeatures([
            ...features,
            [getNextAvailableFeature(features), null],
          ])}
          className={`hover-blue py-2 px-4 rounded mx-auto ${features.length > 0 && 'mt-8'}`}
        >
          Add new filter
        </button>
      </div>

      <TableContext.Provider value={{
        selectedDiacritics,
        setSelectedDiacritics,
        selectedSounds,
        handleDiacriticClick,
      }}
      >
        <div className="mt-8">
          <DiacriticTable>
            Click diacritics to toggle whether symbols with them appear.
          </DiacriticTable>
        </div>
        <div className="mt-8">
          <ConsonantTable editable={false} />
        </div>
        <div className="mt-8">
          <VowelTable allHeights={allHeights} setAllHeights={setAllHeights} editable={false} />
        </div>
      </TableContext.Provider>
    </div>
  );
}
