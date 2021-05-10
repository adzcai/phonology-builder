import TableContainer from '../TableContainer';

const frontness = [
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
          {frontness.map(({ front, back }) => (
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
          {frontness.map(() => (
            <>
              <td>+round</td>
              <td>-round</td>
            </>
          ))}
        </tr>
      </thead>
      <tbody>
        {heights.map((height) => (
          <tr>
            <th>
              {`${sign(height.high)}high, ${sign(height.low)}low${
                'tense' in height ? `, ${sign(height.tense)}tense` : ''}`}
            </th>
          </tr>
        ))}
      </tbody>
    </TableContainer>
  );
}
