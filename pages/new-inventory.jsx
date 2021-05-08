import { manners, matchFeatures, places } from '../src/assets/ipaData';

export default function NewInventory() {
  return (
    <div style={{
      margin: '0px auto',
    }}
    >
      <div style={{ backgroundColor: 'blue' }}>
        {places.map((place) => (
          <div>
            <p>
              {JSON.stringify(place)}
            </p>
            <ul>
              {matchFeatures(place.features, { syllabic: false })
                .map((feature) => <li style={{ display: 'inline', margin: '0px 4px' }}>{feature.Unicode}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ backgroundColor: 'red' }}>
        {manners.map((manner) => (
          <div>
            <p>
              {JSON.stringify(manner)}
            </p>
            <ul>
              {matchFeatures(manner.features, { syllabic: false })
                .map((feature) => <li style={{ display: 'inline', margin: '0px 4px' }}>{feature.Unicode}</li>)}
            </ul>
          </div>
        ))}
      </div>

    </div>
  );
}
