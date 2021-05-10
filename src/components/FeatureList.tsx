import { allFeatures, Sound } from '../assets/ipaData';
import TableContainer from './TableContainer';

type Props = {
  sounds: Sound[];
  contrastWith?: Sound;
};

const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'pink'];

type TableRowProps = {
  sound: Sound;
  contrastWith: Sound;
};

// explicitly check if they are two booleans since we don't want a comparison
// with 0 to show up
function trueDifference(a, b, feature) {
  return feature !== 'name' && (a[feature] === true && b[feature] === false) || (a[feature] === false && b[feature] === true);
}

function countDistinctFeatures(a, b) {
  return allFeatures.filter(([feature]) => trueDifference(a, b, feature)).length;
}

function TableRow({ sound, contrastWith }: TableRowProps) {
  if (contrastWith === null) {
    return (
      <tr>
        {allFeatures.map(([feature]) => (
          <td
            key={feature}
            className="text-center p-0 m-0 border-gray-300 border-2"
          >
            {feature === 'name'
              ? sound[feature]
              : sound[feature] === 0
                ? 0
                : sound[feature] ? '+' : '-'}
          </td>
        ))}
      </tr>
    );
  }

  const nDistinct = countDistinctFeatures(sound, contrastWith);

  return (
    <tr>
      {contrastWith && (
      <td className={`text-center p-0 m-0 border-gray-300 border-2
        ${nDistinct === 0 ? 'sticky top-36 bg-white' : `bg-red-${Math.min(Math.max(nDistinct, 1), 9)}00`}`}
      >
        {nDistinct}
      </td>
      )}
      {allFeatures.map(([feature]) => (
        <td
          key={feature}
          className={`text-center p-0 m-0 border-gray-300 border-2 ${nDistinct === 0 && 'sticky top-36 bg-white'}
            ${trueDifference(sound, contrastWith, feature) && 'bg-red-300'}`}
        >
          {feature === 'name'
            ? sound[feature]
            : sound[feature] === 0
              ? 0
              : sound[feature] ? '+' : '-'}
        </td>
      ))}
    </tr>
  );
}

export default function FeatureList({ sounds, contrastWith = null }: Props) {
  return (
    <TableContainer classes="overflow-y-auto max-h-64">
      <thead>
        <tr>
          {contrastWith && <td className="bg-white sticky top-0 h-8" />}
          {Array.from(allFeatures.reduce((map, [_, __, category]) => {
            map.set(category, (map.get(category) || 0) + 1);
            return map;
          }, new Map())).map(([feature, count], i) => <th colSpan={count} className={`bg-${colors[i]}-300 sticky top-0 h-8`}>{feature}</th>)}
        </tr>
        <tr>
          {contrastWith && <td className="w-8 h-28 p-0 m-0 sticky top-8 border-gray-300 border-2 bg-gradient-to-b from-white to-transparent via-white" />}
          {allFeatures.map(([feature]) => (
            <th key={feature} className="w-8 h-28 p-0 m-0 sticky top-8 bg-gradient-to-b from-white to-transparent via-white">
              <div
                className="flex items-center justify-end w-full h-full border-gray-300 border-2"
                style={{
                  writingMode: 'vertical-rl', textOrientation: 'mixed', textAlign: 'right', height: '100%',
                }}
              >
                {feature === 'delayed release' ? 'del rel' : feature}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(contrastWith === null
          ? sounds
          : sounds.slice()
            // eslint-disable-next-line max-len
            .sort((a, b) => countDistinctFeatures(a, contrastWith) - countDistinctFeatures(b, contrastWith))
        ).map((sound) => (
          <TableRow key={sound.name} sound={sound} contrastWith={contrastWith} />
        ))}
      </tbody>
    </TableContainer>
  );
}
