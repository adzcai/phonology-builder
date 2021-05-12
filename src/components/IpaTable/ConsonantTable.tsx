import React, { useCallback, useContext, useState } from 'react';
import {
  allManners as rawManners,
  allPlaces, Diacritic, filterNonEmpty, matchFeatures, TableContext,
} from '../../assets/ipaData';
import TableContainer from '../TableContainer';
import TableCell from './TableCell';

export default function ConsonantTable({ editable }: { editable: boolean }) {
  const { allSounds, selectedSounds, deleteFeatureSet } = useContext(TableContext);
  const [allManners, setAllManners] = useState(rawManners);

  const sounds = editable ? allSounds : selectedSounds;

  const places = filterNonEmpty(sounds, allPlaces, { syllabic: false });
  const manners = filterNonEmpty(sounds, allManners, { syllabic: false });

  const insertBelow = useCallback((row: number, diacritic: Diacritic) => {
    const manner = manners[row];
    if (!diacritic.createNewRow || manners.some((m) => m.name === `${diacritic.displayName} ${manner.name}`)) return;
    const index = manners.findIndex((a) => a === manner);

    setAllManners([
      ...manners.slice(0, index),
      {
        name: manner.name,
        features: [
          manner.features,
          (sound) => !Object.keys(diacritic.features)
            .every((key) => sound[key] === diacritic.features[key]),
        ],
      },
      { name: `${diacritic.displayName} ${manner.name}`, features: [manner.features, diacritic.features] },
      ...manners.slice(index + 1)]);
  }, [manners]);

  if (manners.length === 0) return <p className="rounded bg-red-200 py-2 px-4 mx-auto w-max">No consonant sounds selected!</p>;

  return (
    <TableContainer>
      <thead>
        <tr>
          <td className="border-gray-300 border-b-2 border-r-4 sticky left-0 bg-gradient-to-r from-white via-white to-transparent" />
          {editable && (
            <td className="border-gray-300 border-b-2 border-r-2" />
          )}
          {/* only show a column if there is a selected sound in that column */}
          {places.map((col, i) => (
            <th
              key={col.name}
              className={`border-gray-300 border-l-2 ${i < places.length - 1 && 'border-r-2'} border-b-2 px-2`}
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
      <tbody>
        {manners.map((manner, row) => (
          <tr key={manner.name}>
            {/* head of row */}
            <th
              className={`border-gray-300 border-t-2 ${row !== manners.length && 'border-b-2'} border-r-4 sticky left-0
        bg-gradient-to-r from-white via-white to-transparent px-2`}
              title={JSON.stringify(manner.features)}
            >
              {manner.name.replace('lateral', 'lat.').replace('approximant', 'approx.')}
            </th>
            {editable && (
            <th
              className={`border-gray-300 border-t-2 ${row !== manners.length && 'border-b-2'} border-r-2 px-1 bg-red-200 hover:bg-red-500 cursor-pointer`}
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
            {places.map((place, i) => (
              <TableCell
                key={place.name}
                last={i === places.length - 1}
                lastRow={row === manners.length - 1}
                sounds={matchFeatures(
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
    </TableContainer>
  );
}
