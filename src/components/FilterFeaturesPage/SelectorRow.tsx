import React, { ChangeEventHandler } from 'react';
import { allFeatures } from '../../assets/ipa-data';
import { SerializedFeatureValue } from '../../lib/client/types';

type SelectorRowProps = {
  selected: string;
  setSelected: ChangeEventHandler<HTMLSelectElement>;
  val: SerializedFeatureValue;
  setVal: (_: SerializedFeatureValue) => void;
  removeFeature: () => void;
  features: string[][];
  groupName: React.Key;
};

export default function SelectorRow({
  selected, setSelected, val, setVal, removeFeature, features, groupName,
}: SelectorRowProps) {
  const optGroups = [...new Set(allFeatures.map(([, category]) => category))];

  return (
    <li className="border-gray-300 border-4 w-max bg-white rounded-xl p-2">
      <div>
        <select value={selected} onChange={setSelected} className="outline-none border-b-2 border-gray-300">
          <option>{null}</option>
          {optGroups.map((category) => (
            <optgroup key={category} label={category}>
              {allFeatures.filter(([, cat]) => cat === category).map(([featureName]) => (
                <option
                  key={`${groupName}-${featureName}`}
                  value={featureName}
                  disabled={features.some(([feature]) => feature === featureName)}
                >
                  {featureName}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <button type="button" className="px-2 rounded bg-red-200 hover:bg-red-500 focus:outline-none" onClick={removeFeature}>-</button>
      </div>
      <div className="w-full flex justify-between">
        {['+', '-', '0'].map((v) => (
          <label key={v} htmlFor={`${groupName}-${selected}`}>
            {v}
            <input
              type="radio"
              id={`${groupName}-${selected}`}
              name={`${groupName}-${selected}`}
              value={v}
              checked={val === v}
              onChange={(e) => setVal(e.currentTarget.value as SerializedFeatureValue)}
              className="ml-1"
            />
          </label>
        ))}
      </div>
    </li>
  );
}
