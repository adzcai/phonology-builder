import React, { useState } from 'react';
import {
  allSounds, toggleInArray, TableContext,
  canApplyDiacriticsToSound, applyDiacriticsToSound, allHeights as rawHeights,
  matchSounds, cloneSound, deserializeFeatureValue,
} from '../src/assets/ipa-data';
import ConsonantTable from '../src/components/IpaTable/ConsonantTable';
import VowelTable from '../src/components/IpaTable/VowelTable';
import DiacriticTable from '../src/components/IpaTable/DiacriticTable';
import {
  Diacritic, Features, Height, SerializedFeatureList,
} from '../src/lib/types';
import Layout from '../src/components/Layout';
import FeatureSelector from '../src/components/FilterFeaturesPage/FeatureSelector';

export default function FilterFeaturesPage() {
  const [filters, setFilters] = useState<SerializedFeatureList>([]);
  const [soundChanges, setSoundChanges] = useState<SerializedFeatureList>([]);
  const [selectedDiacritics, setSelectedDiacritics] = useState<Diacritic[]>([]);
  const [allHeights, setAllHeights] = useState<Height[]>(rawHeights);

  const validFeatures = filters.filter((feature) => feature[0] !== '' && feature[1] !== null);

  const soundsWithDiacritics = [
    ...allSounds,
    ...selectedDiacritics
      .flatMap((diacritic) => allSounds
        .filter((sound) => canApplyDiacriticsToSound([diacritic], sound.features))
        .map((sound) => applyDiacriticsToSound(sound, diacritic))),
  ];

  let selectedSounds = validFeatures.length === 0
    ? []
    : matchSounds(soundsWithDiacritics, validFeatures.map(([name, val]) => ({
      [name]: deserializeFeatureValue(val),
    })));

  const changesToApply: Partial<Features> = soundChanges
    .filter(([name, value]) => name !== '' && value !== null)
    .reduce((prev, [name, val]) => ({ ...prev, [name]: deserializeFeatureValue(val) }), {});

  if (Object.keys(changesToApply).length > 0) {
    selectedSounds = selectedSounds.map((sound) => {
      const soundToFind = cloneSound(sound);
      Object.assign(soundToFind.features, changesToApply);
      const found = matchSounds(soundsWithDiacritics, soundToFind.features);
      return { ...sound, symbol: `${sound.symbol} → ${found.length > 0 ? found[0].symbol : '?'}` };
    });
  }

  const handleDiacriticClick = (diacritic: Diacritic) => setSelectedDiacritics(
    toggleInArray(selectedDiacritics, diacritic),
  );

  return (
    <Layout>
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
    </Layout>
  );
}
