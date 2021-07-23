import {
  useContext, useState, useEffect, useCallback,
} from 'react';
import UserCharts from '../src/components/SelectSoundsPage/UserCharts';
import RuleContainer from '../src/components/EvolvePage/RuleContainer';
import WordSelector from '../src/components/EvolvePage/WordSelector';
import { GlobalContext } from '../src/lib/client/context';
import RequireUser from '../src/components/RequireUser';
import fetcher, { postJson } from '../src/lib/client/fetcher';
import type { Evolution, Rule } from '../src/lib/client/types';
import { createRule } from '../src/lib/client/util';

export default function EvolvePage() {
  const [evolutions, setEvolutions] = useState<Evolution[]>(null);
  const [selectedEvolution, setSelectedEvolution] = useState<Evolution>(null);
  const { selectedChart } = useContext(GlobalContext);
  const [rules, setRules] = useState<Rule[]>(null);

  useEffect(() => {
    if (selectedChart?._id) {
      fetcher(`/api/charts/${selectedChart._id}/evolutions`)
        .then((data) => setEvolutions(data))
        .catch((err) => alert(err));
    }
  }, [selectedChart]);

  useEffect(() => {
    if (selectedEvolution) {
      console.log('rules', selectedEvolution.rules);
      setRules(selectedEvolution.rules);
    }
  }, [selectedEvolution]);

  return (
    <RequireUser>
      <UserCharts />
      <WordSelector />
      {selectedChart
      && (
      <div className="container">
        <nav className="container flex">
          <ul className="contents">
            {evolutions && evolutions.map((evolution, i) => (
              <li key={evolution._id}>
                <button
                  type="button"
                  onClick={() => setSelectedEvolution(evolution)}
                  className="hover-blue rounded-t px-4 py-2"
                >
                  Evolution #
                  {i}
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => postJson('/api/evolutions', { from: selectedChart._id })
              .then((data) => setEvolutions(data))
              .catch((err) => alert(`error posting evolutions: ${err}`))}
            className="bg-green-300 hover:bg-green-500 transition-colors shadow px-4 py-2 rounded-t"
          >
            Create new evolution
          </button>
        </nav>
        <div className="relative container flex flex-col items-center bg-gray-50 p-4 gap-2">
          {rules ? (
            rules.length === 0 ? (
              <>
                <p>This evolution doesn&apos;t have any rules yet.</p>
                <button
                  type="button"
                  onClick={() => setRules([...rules, createRule()])}
                  className="hover-blue px-4 py-2 rounded"
                >
                  Create new rule
                </button>
              </>
            ) : rules.map(({ id }, i) => (
              <RuleContainer
                index={i}
                key={id}
                id={id}
                last={rules.length === 1}
                setRules={setRules}
              />
            ))
          ) : <p>Select an evolution to edit rules!</p>}

          <button
            type="button"
            onClick={() => postJson(`/api/evolutions/${selectedEvolution._id}`, { rules })
              .catch((err) => alert(err))}
            className="hover-blue px-4 py-2 rounded self-end"
          >
            Save evolution
          </button>
        </div>
      </div>
      )}
    </RequireUser>
  );
}
