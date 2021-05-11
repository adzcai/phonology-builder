import { PropsWithChildren, useCallback, useMemo } from 'react';
import { Diacritic } from '../../assets/ipaData';
import { VowelTableProps } from '../../assets/props';
import TableCell from '../TableCell';
import TableContainer from '../TableContainer';

const blBorder = 'border-gray-300 border-l-4 border-b-4';
const brBorder = 'border-gray-300 border-r-4 border-b-4';

export default function VowelTable({
  heights, setHeights, frontnesses, setFrontnesses, editable,
}: VowelTableProps) {
  const insertBelow = useCallback((row: number, diacritic: Diacritic) => {
    const height = heights[row];
    if (!diacritic.createNewRow || heights.some((m) => m.name === `${diacritic.displayName} ${height.name}`)) return;

    setHeights([
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

  const HeaderContainer = ({ name } : { name: string }) => (
    frontnesses.length > 4
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
              <HeaderContainer name={name} />
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
              onClick={() => setFrontnesses((prev) => prev.filter((f) => f !== frontness))}
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
            {editable && (
            <th
              role="button"
              scope="row"
              className="border-gray-300 border-t-4 border-r-4 bg-blue-300 hover:bg-blue-500"
              onClick={() => setHeights((prev) => prev.filter((f) => f !== height))}
            >
              -
            </th>
            )}
            {frontnesses.map((frontness, i) => (
              <TableCell
                key={frontness.name}
                features={[frontness.features, height.features, { syllabic: true }]}
                last={i === frontnesses.length}
                lastRow={row === heights.length - 1}
                editable={editable}
                insertBelow={(diacritic) => insertBelow(row, diacritic)}
                areBordersCollapsed
              />
            ))}
          </tr>
        ))}
      </tbody>
    </TableContainer>
  );
}
