import React, { useContext } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Chart } from '../../lib/types';
import { RulesContext } from '../../lib/context';

export default function UserCharts() {
  const { data: user } = useSWR('/api/user');
  const { data: charts } = useSWR(`/api/charts/${user.data.username}`);
  const { setSelectedChart } = useContext(RulesContext);

  if (!charts) return <p>Loading...</p>;

  if (charts.errorMessage) {
    console.error(charts.errorMessage);
    return (
      <p>
        An error occurred:
        {charts.errorMessage}
      </p>
    );
  }

  if (charts.data.charts.length === 0) {
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
        {charts.data.charts.map((chart: Chart) => (
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
