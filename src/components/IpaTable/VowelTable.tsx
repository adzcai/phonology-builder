import {
  useCallback, useContext, useState,
} from 'react';
import {
  allHeights as rawHeights, Diacritic, filterNonEmpty, TableContext,
  allFrontnesses, Height, matchFeatures,
} from '../../assets/ipaData';
import TableCell from './TableCell';
import TableContainer from '../TableContainer';

const blBorder = 'border-gray-300 border-l-4 border-b-4';
const brBorder = 'border-gray-300 border-r-4 border-b-4';

const HeaderContainer = ({ name, nCols } : { name: string, nCols: number }) => (
  nCols > 4
    ? (
      <div
        className="flex items-center justify-end mx-auto w-full leading-4 h-24"
        style={{ writingMode: 'vertical-rl', transform: 'scaleX(-1) scaleY(-1)' }}
      >
        {name}
      </div>
    )
    : (
      <div
        className="text-center w-full"
      >
        {name}
      </div>
    )
);

export default function VowelTable({ editable }: { editable: boolean }) {
  const { allSounds, selectedSounds, deleteFeatureSet } = useContext(TableContext);

  const sounds = editable ? allSounds : selectedSounds;

  const [allHeights, setAllHeights] = useState<Height[]>(rawHeights);

  const heights = filterNonEmpty(sounds, allHeights, { syllabic: true });
  const frontnesses = filterNonEmpty(sounds, allFrontnesses, { syllabic: true });

  // will only render if editable
  const insertBelow = useCallback((row: number, diacritic: Diacritic) => {
    const height = heights[row];
    if (!diacritic.createNewRow || heights.some((m) => m.name === `${diacritic.displayName} ${height.name}`)) return;

    setAllHeights([
      ...heights.slice(0, row),
      {
        name: height.name,
        features: [
          height.features,
          (sound) => !Object.keys(diacritic.features)
            .every((key) => sound[key] === diacritic.features[key]),
        ],
      },
      { name: `${diacritic.displayName} ${height.name}`, features: [height.features, diacritic.features] },
      ...heights.slice(row + 1)]);
  }, [heights]);

  if (heights.length === 0) return <p className="rounded bg-red-200 py-2 px-4 mx-auto w-max">No vowel sounds selected!</p>;

  return (
    <TableContainer tableClasses="table-fixed" borderCollapse>
      <colgroup>
        <col className="w-24" />
        {editable && <col className="w-6" />}
        {frontnesses.map(({ name }) => <col key={name} />)}
      </colgroup>
      <thead>
        <tr>
          <td className="border-gray-300 border-r-4 border-b-4" />
          {editable && <td className="border-gray-300 border-r-4 border-b-4" />}
          {frontnesses.map(({ name, features }) => (
            <th
              key={name}
              className="border-gray-300 border-l-4 border-b-4 whitespace-normal"
              title={JSON.stringify(features)}
            >
              <HeaderContainer name={name} nCols={frontnesses.length} />
            </th>
          ))}
        </tr>
        {editable && (
        <tr>
          <td className={brBorder} />
          <td className={`${brBorder} px-2`} />
          {frontnesses.map((frontness) => (
            <th
              key={frontness.name}
              role="button"
              className={`${blBorder} bg-blue-300 hover:bg-blue-500 w-full leading-none`}
              onClick={() => deleteFeatureSet(frontness)}
            >
              -
            </th>
          ))}
        </tr>
        )}
      </thead>
      <tbody>
        {heights.map((height, row) => (
          <tr key={height.name}>
            <th className="border-gray-300 border-t-4 border-r-4 px-2" scope="row">
              {height.name}
            </th>
            {/* remove row/height button */}
            {editable && (
            <th
              role="button"
              scope="row"
              className="border-gray-300 border-t-4 border-r-4 bg-blue-300 hover:bg-blue-500"
              onClick={() => deleteFeatureSet(height)}
            >
              -
            </th>
            )}
            {frontnesses.map((frontness, i) => (
              <TableCell
                key={frontness.name}
                sounds={matchFeatures(
                  sounds,
                  frontness.features, height.features,
                  { syllabic: true },
                )}
                last={i === frontnesses.length - 1}
                lastRow={row === heights.length - 1}
                insertBelow={(diacritic) => insertBelow(row, diacritic)}
                collapseBorders
                editable={editable}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </TableContainer>
  );
}
