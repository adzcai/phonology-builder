import { VowelTableProps } from '../../assets/props';
import TableCell from '../TableCell';
import TableContainer from '../TableContainer';

const blBorder = 'border-gray-300 border-l-4 border-b-4';
const brBorder = 'border-gray-300 border-r-4 border-b-4';

export default function VowelTable({
  heights, setHeights, frontnesses, setFrontnesses, editable,
}: VowelTableProps) {
  return (
    <TableContainer borderCollapse>
      <thead>
        {/* <tr>
          <td />
          {frontnesses.map(({ name }) => (
            <th colSpan={2} key={name}>
              {name}
            </th>
          ))}
        </tr> */}
        <tr>
          <td className="border-gray-300 border-r-4 border-b-4" />
          {editable && <td className="border-gray-300 border-r-4 border-b-4" />}
          {frontnesses.map(({ name }) => (
            <th key={name} className="border-gray-300 border-l-4 border-b-4 h-24 whitespace-normal">
              <div
                className="flex items-center justify-end mx-auto leading-4"
                style={{ writingMode: 'vertical-rl', transform: 'scaleX(-1) scaleY(-1)' }}
              >
                {name}
              </div>
            </th>
          ))}
        </tr>
        {editable && (
        <tr>
          <td className={brBorder} />
          <td className={brBorder} />
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
            <th className="border-gray-300 border-t-4 border-r-4 px-2">
              {height.name}
            </th>
            {editable && (
            <th
              role="button"
              className="border-gray-300 border-t-4 border-r-4 bg-blue-300 hover:bg-blue-500 w-4"
              onClick={() => setHeights((prev) => prev.filter((f) => f !== height))}
            >
              -
            </th>
            )}
            {frontnesses.map((frontness, i) => (
              <TableCell
                features={[frontness, height, { syllabic: true }]}
                last={i === frontnesses.length}
                lastRow={row === heights.length - 1}
                editable={editable}
                areBordersCollapsed
              />
            ))}
          </tr>
        ))}
      </tbody>
    </TableContainer>
  );
}
