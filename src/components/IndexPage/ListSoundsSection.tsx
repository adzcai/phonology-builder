import { Link } from 'react-router-dom';
import { Sound } from '../../assets/ipa-data';
import TableContainer from '../TableContainer';
import FeatureList from './FeatureList';

export default function ListSoundsSection({ sounds }: { sounds: Sound[] }) {
  return (
    <>
      <p className="mx-auto text-center mb-8">
        Hover a feature to see its definition.
      </p>

      <FeatureList sounds={sounds} />

      <h2 className="text-xl font-bold">The sonority hierarchy</h2>
      <TableContainer borderCollapse>
        <thead>
          <tr>
            {['Vowels', 'Glides', 'Liquids', 'Nasals', 'Obstruents'].map((soundClass) => <th key={soundClass} className="border-gray-300 border-4 px-2">{soundClass}</th>)}
          </tr>
        </thead>
        <tbody className="text-center">
          <tr>
            <td className="border-gray-300 border-4 px-2">[+syllabic]</td>
            <td className="border-gray-300 border-4 px-2" colSpan={4}>[-syllabic]</td>
          </tr>
          <tr>
            <td className="border-gray-300 border-4 px-2" colSpan={2}>[-consonantal]</td>
            <td className="border-gray-300 border-4 px-2" colSpan={3}>[+consonantal]</td>
          </tr>
          <tr>
            <td className="border-gray-300 border-4 px-2" colSpan={3}>[+approximant]</td>
            <td className="border-gray-300 border-4 px-2" colSpan={2}>[-approximant]</td>
          </tr>
          <tr>
            <td className="border-gray-300 border-4 px-2" colSpan={4}>[+sonorant]</td>
            <td className="border-gray-300 border-4 px-2">[-sonorant]</td>
          </tr>
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
  );
}
