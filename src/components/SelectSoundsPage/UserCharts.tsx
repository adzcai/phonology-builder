import React, { useContext } from 'react';
import Link from 'next/link';
import { FaTrash } from 'react-icons/fa';
import { GlobalContext, useCharts, useUser } from '../../lib/client/context';
import fetcher from '../../lib/client/fetcher';

export default function UserCharts() {
  const { user } = useUser();
  const { charts, chartsError, mutateCharts } = useCharts(user);
  const { setSelectedChart } = useContext(GlobalContext);

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
          <li key={chart.name} className="flex">
            <button
              type="button"
              className="bg-green-300 hover:bg-green-500 drop-shadow rounded p-2 w-12 min-w-max"
              onClick={() => setSelectedChart(chart)}
            >
              {chart.name}
            </button>
            <button
              type="button"
              className="bg-red-300 hover:bg-red-500 rounded drop-shadow transition-all p-2"
              onClick={async () => {
                try {
                  await fetcher(`/api/charts/${user.username}/${chart.name}`, {
                    method: 'DELETE',
                  });
                  await mutateCharts();
                } catch (err) {
                  alert(err.info.message);
                }
              }}
            >
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
