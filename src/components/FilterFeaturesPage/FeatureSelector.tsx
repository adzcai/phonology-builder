import React, { Dispatch, ReactNode, SetStateAction } from 'react';
import { allFeatures } from '../../assets/ipa-data';
import { Features, SerializedFeatureList } from '../../lib/types';
import SelectorRow from './SelectorRow';

type Props = {
  features: SerializedFeatureList;
  setFeatures: Dispatch<SetStateAction<SerializedFeatureList>>;
  buttonLabel: ReactNode;
  groupName: React.Key;
  flexDirection?: 'row' | 'col';
};

function getNextAvailableFeature(features: string[][]) {
  return allFeatures.find(([feat]) => !features.some(([name]) => feat === name))[0];
}

export default function FeatureSelector({
  features, setFeatures, buttonLabel, groupName, flexDirection,
}: Props) {
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      {features.length > 0 && (
      <ul className={`flex flex-${flexDirection || 'row'} flex-wrap gap-2`}>
        {features.map(([selected, val], i) => (
          <SelectorRow
            key={selected}
            selected={selected}
            setSelected={(e) => setFeatures((prev) => [
              ...prev.slice(0, i),
              [e.target.value as keyof Features, val],
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
            groupName={groupName}
          />
        ))}
      </ul>
      )}
      <button
        type="button"
        onClick={() => setFeatures((prev) => [
          ...prev,
          [getNextAvailableFeature(prev), null],
        ])}
        className="flex items-center justify-center text-sm hover-blue w-full p-2 rounded-lg mx-auto"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
