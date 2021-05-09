import {
  manners, matchFeatures, places, Sound,
} from '../assets/ipaData';

export default function DisplayIpaTable({ selectedSounds }) {
  const selectedSoundsArr: Sound[] = Array.from(selectedSounds);
  const allPlaces = places.filter((place) => matchFeatures(selectedSoundsArr, place.features).length);
  const allManners = manners.filter((manner) => matchFeatures(selectedSoundsArr, manner.features).length);

  return (
    <table>
      <thead>
        <tr>
          <th />
          {allPlaces.map((place) => <th key={place.name}>{place.name}</th>)}
        </tr>
      </thead>
      <tbody>
        {allManners.map((manner) => (
          <tr key={manner.name}>
            <td>{manner.name}</td>
            {allPlaces.map((place) => (
              <td key={place.name}>
                {matchFeatures(selectedSoundsArr, place.features, manner.features).map((sound) => sound.name).join(' ')}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
