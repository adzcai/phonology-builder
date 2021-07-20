import React, { useContext } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Chart } from '../../lib/types';
import { TableContext } from '../../lib/context';

export default function UserCharts() {
  const { data: user } = useSWR('/api/user');
  const { setSelectedChart } = useContext(TableContext);

  if (!user) return <p>Loading...</p>;

  if (user.errorMessage) {
    console.error(user.errorMessage);
    return (
      <p>
        An error occurred:
        {user.errorMessage}
      </p>
    );
  }

  if (!user.data.isLoggedIn) {
    return (
      <p>
        <Link href="/"><a href="/" className="underline">Sign up</a></Link>
        {' '}
        to save your own sound charts!
      </p>
    );
  }

  if (user.data.charts.length === 0) {
    return (
      <p>
        No charts found. Save some under
        {' '}
        <Link href="/choose-sounds"><a href="/choose-sounds" className="underline">Choose sounds</a></Link>
        !
      </p>
    );
  }

  return (
    <>
      <p className="mx-auto w-full text-center">Click a chart to load it!</p>
      <ul className="flex flex-wrap gap-4 justify-center">
        {user.data.charts.map((chart: Chart) => (
          <li key={chart.name}>
            <button
              type="button"
              className="bg-green-300 hover:bg-green-500 drop-shadow rounded p-2"
              onClick={() => setSelectedChart(chart)}
            >
              {chart.name}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
