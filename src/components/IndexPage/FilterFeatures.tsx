import React, {
  ChangeEventHandler, Dispatch, SetStateAction, useState,
} from 'react';
import {
  allFeatures, matchFeatures, allSounds, toggleInArray, Diacritic, TableContext,
  canApplyDiacriticsToSound, applyDiacriticsToSound, allHeights as rawHeights, Height,
} from '../../assets/ipa-data';
import ConsonantTable from '../IpaTable/ConsonantTable';
import VowelTable from '../IpaTable/VowelTable';
import DiacriticTable from '../IpaTable/DiacriticTable';

type InputValue = '+' | '-' | '0';

type FeatureList = [string, InputValue][];

function getNextAvailableFeature(features: string[][]) {
  return allFeatures.find(([f]) => f !== 'name' && !features.some(([name]) => f === name))[0];
}

type SelectorRowProps = {
  selected: string;
  setSelected: ChangeEventHandler<HTMLSelectElement>;
  val: InputValue;
  setVal: (_: InputValue) => void;
  removeFeature: () => void;
  features: string[][];
  groupName: string;
};

function SelectorRow({
  selected, setSelected, val, setVal, removeFeature, features, groupName,
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
      <button type="button" className="px-2 rounded bg-red-200 hover:bg-red-500 focus:outline-none" onClick={removeFeature}>-</button>
      <div className="w-full flex justify-between">
        {['+', '-', '0'].map((v) => (
          <label key={v} htmlFor={`${selected}-val`}>
            {v}
            <input
              type="radio"
              id={`${selected}-val`}
              name={`${selected}-val-${groupName}`}
              value={v}
              checked={val === v}
              onChange={(e) => setVal(e.currentTarget.value as InputValue)}
              className="ml-1"
            />
          </label>
        ))}
      </div>
    </li>
  );
}

type FeatureSelectorProps = {
  features: FeatureList;
  setFeatures: Dispatch<SetStateAction<FeatureList>>
  buttonLabel: string;
};

function FeatureSelector({ features, setFeatures, buttonLabel }: FeatureSelectorProps) {
  return (
    <div className="flex flex-col justify-center items-center">
      <ul className="flex flex-wrap">
        {features.map(([selected, val], i) => (
          <SelectorRow
            key={selected}
            selected={selected}
            setSelected={(e) => setFeatures((prev) => [
              ...prev.slice(0, i),
              [e.target.value, val],
              ...prev.slice(i + 1),
            ])}
            val={val}
            setVal={(v) => setFeatures((prev) => [
              ...prev.slice(0, i),
              [selected, v],
              ...prev.slice(i + 1),
            ])}
            features={features}
            removeFeature={() => setFeatures(
              (prev) => prev.filter((feature) => feature[0] !== selected),
            )}
            groupName={buttonLabel}
          />
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setFeatures((prev) => [
          ...prev,
          [getNextAvailableFeature(prev), null],
        ])}
        className={`hover-blue py-2 px-4 rounded mx-auto ${features.length > 0 && 'mt-8'}`}
      >
        {buttonLabel}
      </button>
    </div>
  );
}

export default function FilterFeatures() {
  const [filters, setFilters] = useState<FeatureList>([]);
  const [soundChanges, setSoundChanges] = useState<FeatureList>([]);
  const [selectedDiacritics, setSelectedDiacritics] = useState<Diacritic[]>([]);
  const [allHeights, setAllHeights] = useState<Height[]>(rawHeights);

  const validFeatures = filters.filter((feature) => feature[0] !== '' && feature[1] !== null);

  const soundsWithDiacritics = [
    ...allSounds,
    ...selectedDiacritics
      .flatMap((diacritic) => allSounds
        .filter((sound) => canApplyDiacriticsToSound([diacritic], sound))
        .map((sound) => applyDiacriticsToSound(sound, diacritic))),
  ];

  let selectedSounds = validFeatures.length === 0
    ? []
    : matchFeatures(soundsWithDiacritics, validFeatures.map(([name, val]) => ({ [name]: ({ '+': true, '-': false, 0: 0 }[val]) })));

  const changesToApply = soundChanges
    .filter((change) => change[0] !== '' && change[1] !== null)
    .reduce((prev, [name, val]) => ({ ...prev, [name]: ({ '+': true, '-': false, 0: 0 }[val]) }), {});

  if (Object.keys(changesToApply).length > 0) {
    selectedSounds = selectedSounds.map((sound) => {
      const soundToFind = { ...sound };
      Object.keys(changesToApply).forEach((change) => {
        soundToFind[change] = changesToApply[change];
      });
      const found = matchFeatures(soundsWithDiacritics, soundToFind);
      return { ...sound, name: `${sound.symbol} → ${found.length > 0 ? found[0].symbol : '?'}` };
    });
  }

  const handleDiacriticClick = (diacritic) => setSelectedDiacritics(
    toggleInArray(selectedDiacritics, diacritic),
  );

  return (
    <>
      <FeatureSelector features={filters} setFeatures={setFilters} buttonLabel="Add new filter condition" />
      <FeatureSelector features={soundChanges} setFeatures={setSoundChanges} buttonLabel="Add new sound change" />

      <TableContext.Provider value={{
        selectedDiacritics,
        setSelectedDiacritics,
        selectedSounds,
        handleDiacriticClick,
      }}
      >
        <DiacriticTable>
          Click diacritics to toggle whether symbols with them appear.
        </DiacriticTable>
        <ConsonantTable editable={false} />
        <VowelTable allHeights={allHeights} setAllHeights={setAllHeights} editable={false} />
      </TableContext.Provider>
    </>
  );
}
