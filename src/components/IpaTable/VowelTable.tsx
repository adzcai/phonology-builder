import { Fragment } from 'react';
import TableCell from '../TableCell';
import TableContainer from '../TableContainer';

const allFrontness = [
  { front: true, back: false },
  { front: false, back: false },
  { front: false, back: true },
];

const heights = [
  { high: true, low: false, tense: true },
  { high: true, low: false, tense: false },
  { high: false, low: false, tense: true },
  { high: false, low: false, tense: false },
  { high: false, low: true },
];

const sign = (bool) => (bool ? '+' : '-');

export default function VowelTable() {
  return (
    <TableContainer>
      <thead>
        <tr>
          <td />
          {allFrontness.map(({ front, back }) => (
            <th colSpan={2} key={`${front} ${back}`}>
              [
              {sign(front)}
              front,
              {sign(back)}
              back]
            </th>
          ))}
        </tr>
        <tr>
          <td />
          {allFrontness.map((f) => (
            <Fragment key={JSON.stringify(f)}>
              <td>+round</td>
              <td>-round</td>
            </Fragment>
          ))}
        </tr>
      </thead>
      <tbody>
        {heights.map((height, row) => (
          <tr key={JSON.stringify(height)}>
            <th>
              {`${sign(height.high)}high, ${sign(height.low)}low${
                'tense' in height ? `, ${sign(height.tense)}tense` : ''}`}
            </th>
            {
              allFrontness.map((f, i) => (
                <>
                  <TableCell
                    features={[f, height, { round: false, syllabic: true }]}
                    last={i === allFrontness.length - 1}
                    lastRow={row === heights.length - 1}
                    editable
                  />
                  <TableCell
                    features={[f, height, { round: true, syllabic: true }]}
                    last={i === allFrontness.length - 1}
                    lastRow={row === heights.length - 1}
                    editable
                  />
                </>
              ))
            }
          </tr>
        ))}
      </tbody>
    </TableContainer>
  );
}
