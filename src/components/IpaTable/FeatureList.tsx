/* eslint-disable @typescript-eslint/no-unused-vars */
import { allFeatures } from '../../assets/ipa-data';
import { serializeFeatureValue } from '../../lib/api/serialization';
import { Phoneme } from '../../lib/client/types';
import {
  countDistinctFeatures, sortSoundsBySimilarityTo, trueDifference,
} from '../../lib/client/util';
import TableContainer from './TableContainer';

type Props = {
  sounds: Phoneme[];
  contrastWith?: Phoneme;
};

type TableRowProps = {
  sound: Phoneme;
  contrastWith: Phoneme;
};

const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'pink'];

function TableRow({ sound, contrastWith }: TableRowProps) {
  if (contrastWith === null) {
    return (
      <tr>
        <td className="text-center border-gray">{sound.symbol}</td>
        {allFeatures.map(([feature]) => (
          <td
            key={feature}
            className="text-center border-gray"
          >
            {serializeFeatureValue(sound.features[feature])}
          </td>
        ))}
      </tr>
    );
  }

  const nDistinct = countDistinctFeatures(sound.features, contrastWith.features);

  return (
    <tr>
      <td className={`text-center border-gray
        ${nDistinct === 0 ? 'sticky top-36 bg-white' : `bg-red-${Math.min(Math.max(nDistinct, 1), 9)}00`}`}
      >
        {nDistinct}
      </td>
      <td>{sound.symbol}</td>
      {allFeatures.map(([feature]) => (
        <td
          key={feature}
          className={`text-center border-gray ${nDistinct === 0 && 'sticky top-36 bg-white'}
            ${trueDifference(sound.features, contrastWith.features, feature) && 'bg-red-300'}`}
        >
          {serializeFeatureValue(sound.features[feature])}
        </td>
      ))}
    </tr>
  );
}

const VerticalCell = ({ title, content }: { title: string, content: string }) => (
  <th className="w-8 h-28 sticky top-8 bg-white" title={title}>
    <div
      className="flex items-center w-full h-full border-gray"
      style={{ writingMode: 'vertical-rl', transform: 'scaleX(-1) scaleY(-1)' }}
    >
      {content}
    </div>
  </th>
);

export default function FeatureList({ sounds, contrastWith = null }: Props) {
  const allSounds = contrastWith === null
    ? sounds
    : sortSoundsBySimilarityTo(sounds, contrastWith.features);

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
          <td className="border-gray" />
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
          <VerticalCell title="the IPA character of this segment" content="symbol" />
          {allFeatures.map(([feature, _, description]) => (
            <VerticalCell key={feature} title={description} content={feature === 'delayed release' ? 'del rel' : feature} />
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
