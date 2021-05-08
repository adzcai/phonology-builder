import { matchFeatures } from '../assets/ipaData';
import styles from './MannerRow.module.css';

// const findIpaConsonants = (place, manner, features = []) => symbols.filter((sym) => sym.place.toLowerCase() === place.toLowerCase() && sym.manner.toLowerCase() === manner.toLowerCase() && features.every((feature) => sym.features.includes(feature)));

// const getIpaConsonantSymbols = (syms) => {
//   if (syms.length === 1) {
//     if (syms[0].features?.includes('voice')) {
//       return (
//         <>
//           <td />
//           <td>{syms[0].symbol}</td>
//         </>
//       );
//     } return (
//       <>
//         <td style={{ textAlign: 'right' }}>{syms[0].symbol}</td>
//         <td />
//       </>
//     );
//   }
//   if (syms.length === 2) {
//     const voicedIndex = syms.findIndex((sym) => sym.features?.includes('voice'));
//     return (
//       <>
//         <td style={{ textAlign: 'right' }}>{syms[1 - voicedIndex].symbol}</td>
//         <td>{syms[voicedIndex].symbol}</td>
//       </>
//     );
//   }
//   return <td colSpan={2} />;
// };

const showContextMenu = (e, manner) => {

};

export default function MannerRow({ manner, columns }) {
  return (
    <tr key={manner}>
      <td>
        {manner.name}
        <div className={styles['dropdown-container']}>
          <button type="button" onClick={(e) => showContextMenu(e, manner)}>+</button>
        </div>
      </td>
      {columns.map((place) => (
        <td key={place.name}>
          {matchFeatures(manner.features, place.features, { syllabic: false }).map((feature) => feature.Unicode).join(' ')}
        </td>
      ))}
    </tr>
  );
}
