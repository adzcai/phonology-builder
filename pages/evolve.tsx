import { useContext } from 'react';
import UserCharts from '../src/components/SelectSoundsPage/UserCharts';
import RuleContainer from '../src/components/EvolvePage/RuleContainer';
import WordSelector from '../src/components/EvolvePage/WordSelector';
import { RulesContext } from '../src/lib/client/context';
import RequireUser from '../src/components/RequireUser';

export default function EvolvePage() {
  const { rules } = useContext(RulesContext);

  return (
    <RequireUser>
      <UserCharts />
      <WordSelector />
      <div className="relative flex flex-col">
        {rules.map(({ id }, i) => (
          <RuleContainer
            index={i}
            key={id}
            id={id}
            last={rules.length === 1}
          />
        ))}
      </div>
    </RequireUser>
  );
}
