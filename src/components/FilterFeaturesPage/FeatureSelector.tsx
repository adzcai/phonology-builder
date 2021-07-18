import React, { Dispatch, SetStateAction } from 'react';
import { allFeatures } from '../../assets/ipa-data';
import { SerializedFeatureList } from '../../lib/types';
import SelectorRow from './SelectorRow';

type Props = {
  features: SerializedFeatureList;
  setFeatures: Dispatch<SetStateAction<SerializedFeatureList>>
  buttonLabel: string;
};

function getNextAvailableFeature(features: string[][]) {
  return allFeatures.find(([feat]) => !features.some(([name]) => feat === name))[0];
}

export default function FeatureSelector({ features, setFeatures, buttonLabel }: Props) {
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
