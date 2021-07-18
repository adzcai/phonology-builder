import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Sound } from '../../assets/ipa-data';
import TableContainer from '../TableContainer';
import FeatureList from './FeatureList';

const SonorityHierarchy = memo(() => (
  <>
    <h2 className="text-xl font-bold">The sonority hierarchy</h2>
    <TableContainer borderCollapse>
      <thead>
        <tr>
          {['Vowels', 'Glides', 'Liquids', 'Nasals', 'Fricatives', 'Affricates', 'Stops'].map((soundClass) => (
            <th key={soundClass} className="border-gray-300 border-4 px-2">{soundClass}</th>
          ))}
        </tr>
      </thead>
      <tbody className="text-center">
        {['syllabic', 'consonantal', 'approximant', 'sonorant', 'continuant', 'delayed release'].map((feature, i) => (
          <tr key={feature}>
            <td className="border-gray-300 border-4 px-2" colSpan={i + 1}>
              [
              {feature === 'consonantal' ? '-' : '+' }
              {feature}
              ]
            </td>
            <td className="border-gray-300 border-4 px-2" colSpan={7 - i}>
              [
              {feature === 'consonantal' ? '+' : '-' }
              {feature}
              ]
            </td>
          </tr>
        ))}
      </tbody>
    </TableContainer>
    <div className="mx-auto text-center p-4 max-w-lg w-full md:w-max bg-pink-300 rounded-2xl mt-8">
      <details>
        <summary className="focus:outline-none cursor-pointer">Explanation</summary>
        <ul>
          <li>
            <strong>vowels</strong>
            {' '}
            are [+syllabic];
          </li>
          <li>
            <strong>glides</strong>
            {' '}
            like [j] and [ɹ] are [-syllabic, -consonantal];
          </li>
          <li>
            <strong>liquids</strong>
            {' '}
            like [r] and [l] are [+consonantal], [+approximant];
          </li>
          <li>
            <strong>nasals</strong>
            {' '}
            like [m] and [n] are [-approximant, +sonorant];
          </li>
          <li>
            <strong>obstruents</strong>
            {' '}
            (stops, fricatives, and affricates) are [-sonorant].
          </li>
        </ul>
        <p>
          You can experiment with these using the
          {' '}
          <Link to="/filter-sounds" className="underline">filter sounds by feature</Link>
          {' '}
          utility.
        </p>
      </details>
    </div>
  </>
));

export default function ListSoundsSection({ sounds }: { sounds: Sound[] }) {
  return (
    <>
      <p className="mx-auto text-center mb-8">
        Hover a feature to see its definition.
      </p>

      <FeatureList sounds={sounds} />

      <SonorityHierarchy />
    </>
  );
}
