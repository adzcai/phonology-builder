/* eslint-disable @typescript-eslint/no-unused-vars */
import { allFeatures, Sound } from '../../assets/ipa-data';
import TableContainer from '../TableContainer';

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
function trueDifference(a: Sound, b: Sound, feature: keyof Sound) {
  return feature !== 'symbol'
    && ((a[feature] === true && b[feature] === false)
    || (a[feature] === false && b[feature] === true));
}

function countDistinctFeatures(a: Sound, b: Sound) {
  return allFeatures.filter(([feature]) => trueDifference(a, b, feature as keyof Sound)).length;
}

function showFeature(sound: Sound, feature: keyof Sound) {
  if (feature === 'symbol') return sound[feature];
  if (sound[feature] === 0) return 0;
  return sound[feature] ? '+' : '-';
}

function TableRow({ sound, contrastWith }: TableRowProps) {
  if (contrastWith === null) {
    return (
      <tr>
        {allFeatures.map(([feature]) => (
          <td
            key={feature}
            className="text-center border-gray"
          >
            {showFeature(sound, feature)}
          </td>
        ))}
      </tr>
    );
  }

  const nDistinct = countDistinctFeatures(sound, contrastWith);

  return (
    <tr>
      <td className={`text-center border-gray
        ${nDistinct === 0 ? 'sticky top-36 bg-white' : `bg-red-${Math.min(Math.max(nDistinct, 1), 9)}00`}`}
      >
        {nDistinct}
      </td>
      {allFeatures.map(([feature]) => (
        <td
          key={feature}
          className={`text-center border-gray ${nDistinct === 0 && 'sticky top-36 bg-white'}
            ${trueDifference(sound, contrastWith, feature as keyof Sound) && 'bg-red-300'}`}
        >
          {showFeature(sound, feature)}
        </td>
      ))}
    </tr>
  );
}

export default function FeatureList({ sounds, contrastWith = null }: Props) {
  const allSounds = contrastWith === null
    ? sounds
    : sounds.slice().sort(
      (a, b) => countDistinctFeatures(a, contrastWith) - countDistinctFeatures(b, contrastWith),
    );

  const categoryCount = allFeatures.reduce((obj, [_, category]) => ({
    ...obj, [category]: (obj[category] || 0) + 1,
  }), {});

  return (
    <TableContainer classes="overflow-y-auto max-h-96">
      <thead>
        <tr>
          {contrastWith && (
          <td className="bg-white sticky top-0 h-8">
            <div className="w-full h-full border-gray" />
          </td>
          )}
          {Object.keys(categoryCount).map((category, i) => (
            <th
              key={category}
              colSpan={categoryCount[category]}
              className={`border-gray bg-${colors[i]}-300 sticky top-0 h-8`}
            >
              {category}
            </th>
          ))}
        </tr>
        <tr>
          {contrastWith && <td className="w-8 h-28 sticky top-8 border-gray bg-white" />}
          {allFeatures.map(([feature, _, description]) => (
            <th key={feature} className="w-8 h-28 sticky top-8 bg-white" title={description}>
              <div
                className="flex items-center w-full h-full border-gray"
                style={{ writingMode: 'vertical-rl', transform: 'scaleX(-1) scaleY(-1)' }}
              >
                {feature === 'delayed release' ? 'del rel' : feature}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {allSounds.map((sound) => (
          <TableRow key={sound.symbol} sound={sound} contrastWith={contrastWith} />
        ))}
      </tbody>
    </TableContainer>
  );
}
