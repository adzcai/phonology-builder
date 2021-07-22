import React, { useContext } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { RulesContext, useUser } from '../../lib/client/context';
import { ChartDocument } from '../../lib/api/apiTypes';

export default function UserCharts() {
  const { user, userError } = useUser();
  const { data: charts, error: chartsError } = useSWR<ChartDocument[]>(() => `/api/charts/${user.username}`);
  const { setSelectedChart } = useContext(RulesContext);

  if (chartsError) {
    if (chartsError.status === 401) return <p>Log in to save your charts!</p>;
    return (
      <p>
        An unexpected error occurred:
        {' '}
        {chartsError.info.message}
      </p>
    );
  }

  if (!charts) return <p>Loading...</p>;

  if (charts.length === 0) {
    return (
      <p>
        No charts found. Save some under
        {' '}
        <Link href="/select-sounds"><a href="/select-sounds" className="underline">Select sounds</a></Link>
        !
      </p>
    );
  }

  return (
    <>
      <p className="mx-auto w-full text-center">Click a chart to load it!</p>
      <ul className="flex flex-wrap gap-4 justify-center">
        {charts.map((chart) => (
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
