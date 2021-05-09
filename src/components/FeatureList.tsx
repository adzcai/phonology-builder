import { allSounds, Sound } from '../assets/ipaData';

const colHeaders = Object.keys(allSounds[0]);

export default function FeatureList({ sounds }: { sounds: Sound[]}) {
  return (
    <div style={{ maxWidth: '80%', margin: '0px auto', overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            {colHeaders.map((header) => (
              <th key={header}>
                <span style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                  {header}
                  {' '}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sounds.map((sound) => (
            <tr>
              {colHeaders.map((header) => (
                <td key={header}>
                  {header === 'name'
                    ? sound[header]
                    : sound[header] === 0
                      ? 0
                      : sound[header] ? '+' : '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
