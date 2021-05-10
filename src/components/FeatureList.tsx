import { useContext } from 'react';
import { allSounds, SoundContext } from '../assets/ipaData';

const colHeaders = Object.keys(allSounds[0]);

export default function FeatureList() {
  const { sounds } = useContext(SoundContext);

  return (
    <div className="overflow-x-auto max-w-2xl mx-auto rounded-xl border-black border-dashed border-4">
      <table className="whitespace-nowrap">
        <thead>
          <tr>
            {colHeaders.map((header) => (
              <th key={header} className="w-8 h-28 p-0 m-0">
                <div style={{
                  writingMode: 'vertical-rl', textOrientation: 'mixed', textAlign: 'right', height: '100%',
                }}
                >
                  {header === 'delayed release' ? 'del rel' : header}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sounds.map((sound) => (
            <tr>
              {colHeaders.map((header) => (
                <td key={header} className="text-center p-0 m-0">
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
