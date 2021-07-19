import {
  Dispatch,
  SetStateAction,
  useCallback, useContext,
} from 'react';
import { allFrontnesses } from '../../assets/ipa-data';
import { TableContext } from '../../lib/context';
import { Height, Diacritic } from '../../lib/types';
import { filterNonEmptyFeatureSets, filterSounds } from '../../lib/util';
import TableCell from './TableCell';
import styles from './VowelTable.module.css';

type Props = {
  editable: boolean,
  allHeights: Height[],
  setAllHeights: Dispatch<SetStateAction<Height[]>>
};

export default function VowelTable({ editable, allHeights, setAllHeights }: Props) {
  const { allSounds, selectedSounds, deleteFeatureSet } = useContext(TableContext);

  const sounds = editable ? allSounds : selectedSounds;

  const heights = filterNonEmptyFeatureSets(sounds, allHeights, { syllabic: true });
  const frontnesses = filterNonEmptyFeatureSets(sounds, allFrontnesses, { syllabic: true });

  // will only render if editable
  const insertBelow = useCallback((row: number, diacritic: Diacritic) => {
    const height = heights[row];
    if (!diacritic.createNewRow || heights.some((m) => m.name === `${diacritic.name} ${height.name}`)) return;

    const heightWithoutDiacriticFeatures = {
      name: height.name,
      features: {
        ...height.features,
        ...Object.keys(diacritic.features)
          .reduce((prev, key) => ({ ...prev, [key]: !diacritic.features[key] }), {}),
      },
    };

    const heightWithDiacriticFeatures = {
      name: `${diacritic.name} ${height.name}`,
      features: { ...height.features, ...diacritic.features },
    };

    setAllHeights([
      ...heights.slice(0, row),
      heightWithoutDiacriticFeatures,
      heightWithDiacriticFeatures,
      ...heights.slice(row + 1)]);
  }, [heights]);

  if (heights.length === 0) return <p className="rounded bg-red-200 py-2 px-4 mx-auto w-max">No vowel sounds selected!</p>;

  return (
    <div className="w-full sm:w-max max-w-full h-full overflow-x-auto rounded-xl border-black border-8 bg-white">
      <table
        className="w-full min-w-max grid items-stretch"
        style={{
          gridTemplateColumns: `auto ${editable ? 'auto' : ''} repeat(${frontnesses.length}, 1fr)`,
        }}
      >
        <thead className="contents">
          <tr className="contents">
            <td className="border-gray" />
            {editable && <td className="border-gray" />}
            {frontnesses.map(({ name, features }) => (
              <th
                key={name}
                className="flex items-end justify-center border-gray whitespace-normal py-2 lg:py-0 lg:px-2"
                title={JSON.stringify(features)}
              >
                <span className={styles['vowel-table-header']}>
                  {name}
                </span>
              </th>
            ))}
          </tr>
          {editable && (
          <tr className="contents">
            <td className="border-gray" />
            <td className="border-gray w-4" />
            {frontnesses.map((frontness) => (
              <th
                key={frontness.name}
                role="button"
                className="border-gray bg-red-200 hover:bg-red-500 w-full leading-none"
                onClick={() => deleteFeatureSet({
                  name: frontness.name,
                  features: { ...frontness.features, syllabic: true },
                })}
              >
                -
              </th>
            ))}
          </tr>
          )}
        </thead>

        <tbody className="contents">
          {heights.map((height, row) => (
            <tr key={height.name} className="contents">
              <th
                className="border-gray px-2"
                scope="row"
                title={JSON.stringify(height.features)}
              >
                {height.name}
              </th>
              {/* remove row/height button */}
              {editable && (
              <th
                role="button"
                scope="row"
                className="border-gray bg-red-200 hover:bg-red-500"
                onClick={() => deleteFeatureSet({
                  name: height.name,
                  features: { ...height.features, syllabic: true },
                })}
              >
                -
              </th>
              )}
              {frontnesses.map((frontness) => (
                <TableCell
                  key={frontness.name}
                  sounds={filterSounds(
                    sounds,
                    frontness.features, height.features,
                    { syllabic: true },
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
