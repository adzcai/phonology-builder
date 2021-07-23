import React, { useState } from 'react';
import {
  allSounds, allHeights as rawHeights,
} from '../src/assets/ipa-data';
import ConsonantTable from '../src/components/IpaTable/ConsonantTable';
import VowelTable from '../src/components/IpaTable/VowelTable';
import DiacriticTable from '../src/components/IpaTable/DiacriticTable';
import {
  Diacritic, Features, Height, SerializedFeatureList,
} from '../src/lib/client/types';
import FeatureSelector from '../src/components/FilterFeaturesPage/FeatureSelector';
import { GlobalContext } from '../src/lib/client/context';
import {
  canApplyDiacriticsToFeatures, applyDiacriticsToSound, filterSounds, deserializeFeatureValue,
  cloneSound, toggleInArray,
} from '../src/lib/client/util';

export default function FilterFeaturesPage() {
  const [filters, setFilters] = useState<SerializedFeatureList>([]);
  const [soundChanges, setSoundChanges] = useState<SerializedFeatureList>([]);
  const [selectedDiacritics, setSelectedDiacritics] = useState<Diacritic[]>([]);
  const [allHeights, setAllHeights] = useState<Height[]>(rawHeights);
  const [selectedChart, setSelectedChart] = useState(null);

  const validFeatures = filters.filter((feature) => feature[0] !== '' && feature[1] !== null);

  const soundsWithDiacritics = [
    ...allSounds,
    ...selectedDiacritics
      .flatMap((diacritic) => allSounds
        .filter((sound) => canApplyDiacriticsToFeatures([diacritic], sound.features))
        .map((sound) => applyDiacriticsToSound(sound, diacritic))),
  ];

  let selectedSounds = validFeatures.length === 0
    ? []
    : filterSounds(soundsWithDiacritics, validFeatures.map(([name, val]) => ({
      [name]: deserializeFeatureValue(val),
    })));

  const changesToApply: Partial<Features> = soundChanges
    .filter(([name, value]) => name !== '' && value !== null)
    .reduce((prev, [name, val]) => ({ ...prev, [name]: deserializeFeatureValue(val) }), {});

  if (Object.keys(changesToApply).length > 0) {
    selectedSounds = selectedSounds.map((sound) => {
      const soundToFind = cloneSound(sound);
      Object.assign(soundToFind.features, changesToApply);
      const found = filterSounds(soundsWithDiacritics, soundToFind.features);
      return { ...sound, symbol: `${sound.symbol} → ${found.length > 0 ? found[0].symbol : '?'}` };
    });
  }

  const handleDiacriticClick = (diacritic: Diacritic) => setSelectedDiacritics(
    toggleInArray(selectedDiacritics, diacritic),
  );

  return (
    <>
      <FeatureSelector features={filters} setFeatures={setFilters} buttonLabel="Add new filter condition" groupName="filter-condition" />
      <FeatureSelector features={soundChanges} setFeatures={setSoundChanges} buttonLabel="Add new sound change" groupName="sound-change" />

      <GlobalContext.Provider value={{
        selectedDiacritics,
        setSelectedDiacritics,
        selectedSounds,
        handleDiacriticClick,
        selectedChart,
        setSelectedChart,
        allHeights,
        setAllHeights,
      }}
      >
        <DiacriticTable>
          Click diacritics to toggle whether symbols with them appear.
        </DiacriticTable>
        <ConsonantTable editable={false} />
        <VowelTable editable={false} />
      </GlobalContext.Provider>
    </>
  );
}
