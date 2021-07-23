import React, { memo } from 'react';
import Link from 'next/link';
import TableContainer from '../IpaTable/TableContainer';

function SonorityHierarchy() {
  return (
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
      <h3 className="text-lg font-bold">Explanation</h3>
      <div className="container text-center">
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
          <Link href="/filter-sounds"><a href="/filter-sounds" className="underline">filter sounds by feature</a></Link>
          {' '}
          utility.
        </p>
      </div>
    </>
  );
}

export default memo(SonorityHierarchy);
