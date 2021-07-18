import React, { useCallback, useContext, useState } from 'react';
import {
  allManners as rawManners,
  allPlaces, filterNonEmptyFeatureSets, matchSounds, TableContext,
} from '../../assets/ipa-data';
import { Diacritic } from '../../lib/types';
import TableCell from './TableCell';

export default function ConsonantTable({ editable }: { editable: boolean }) {
  const { allSounds, selectedSounds, deleteFeatureSet } = useContext(TableContext);
  const [allManners, setAllManners] = useState(rawManners);

  const sounds = editable ? allSounds : selectedSounds;

  const places = filterNonEmptyFeatureSets(sounds, allPlaces, { syllabic: false });
  const manners = filterNonEmptyFeatureSets(sounds, allManners, { syllabic: false });
  console.log(allManners);

  const insertBelow = useCallback((row: number, diacritic: Diacritic) => {
    const manner = manners[row];
    if (!diacritic.createNewRow || manners.some((m) => m.name === `${diacritic.name} ${manner.name}`)) return;

    const index = manners.findIndex((a) => a === manner);

    // the clicked manner, minus all of the features in the diacritic
    const mannerWithoutDiacriticFeatures = {
      name: manner.name,
      features: [
        manner.features,
        (sound) => !Object.keys(diacritic.features)
          .every((key) => sound[key] === diacritic.features[key]),
      ],
    };

    const mannerWithDiacriticFeatures = {
      name: `${diacritic.name} ${manner.name}`,
      features: [manner.features, diacritic.features],
    };

    setAllManners([
      ...manners.slice(0, index),
      mannerWithoutDiacriticFeatures,
      mannerWithDiacriticFeatures,
      ...manners.slice(index + 1)]);
  }, [manners]);

  if (manners.length === 0) return <p className="rounded bg-red-200 py-2 px-4 mx-auto w-max">No consonant sounds selected!</p>;

  return (
    <div className="w-full md:w-max max-w-full h-full overflow-x-auto rounded-xl border-black border-8 bg-white">
      <table className="w-full min-w-max grid items-stretch" style={{ gridTemplateColumns: `auto${editable ? ' auto' : ''} repeat(${places.length}, auto)` }}>
        <thead className="contents">
          <tr className="contents">
            <td className="border-gray sticky left-0 bg-gradient-to-r from-white via-white to-transparent" />
            {editable && <td className="border-gray" />}
            {/* only show a column if there is a selected sound in that column */}
            {places.map((col) => (
              <th
                key={col.name}
                className="border-gray px-2"
                title={JSON.stringify(col.features)}
              >
                <div className="flex items-center justify-center">
                  {col.name}
                  {/* Button to remove a column */}
                  {editable && (
                  <button
                    type="button"
                    onClick={() => deleteFeatureSet({
                      name: col.name,
                      features: { ...col.features, syllabic: false },
                    })}
                    className="text-xs rounded bg-red-200 hover:bg-red-500 px-1 ml-2"
                  >
                    -
                  </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="contents">
          {manners.map((manner, row) => (
            <tr key={manner.name} className="contents">
              {/* head of row */}
              <th
                className={`border-gray sticky left-0
        bg-gradient-to-r from-white via-white to-transparent px-2`}
                title={JSON.stringify(manner.features)}
              >
                {manner.name.replace('lateral', 'lat.').replace('approximant', 'approx.')}
              </th>
              {editable && (
              <th
                className="border-gray px-1 bg-red-200 hover:bg-red-500 cursor-pointer"
                onClick={() => deleteFeatureSet({
                  name: manner.name,
                  features: { ...manner.features, syllabic: false },
                })}
                role="button"
              >
                -
              </th>
              )}
              {/* elements / sounds */}
              {places.map((place) => (
                <TableCell
                  key={place.name}
                  sounds={matchSounds(
                    editable ? allSounds : sounds,
                    place.features, manner.features,
                    { syllabic: false },
                  )}
                  insertBelow={(diacritic) => insertBelow(row, diacritic)}
                  editable={editable}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
