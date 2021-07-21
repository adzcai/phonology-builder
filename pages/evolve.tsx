import useSWR from 'swr';
import { useContext } from 'react';
import Layout from '../src/components/Layout';
import UserCharts from '../src/components/SelectSoundsPage/UserCharts';
import RuleContainer from '../src/components/EvolvePage/RuleContainer';
import WordSelector from '../src/components/EvolvePage/WordSelector';
import { RulesContext } from '../src/lib/context';

export default function EvolvePage() {
  const { data: user } = useSWR('/api/user');

  const { rules } = useContext(RulesContext);

  if (!user?.data) return <Layout>Loading...</Layout>;

  if (!user.data.isLoggedIn) return <Layout>User must be logged in!</Layout>;

  return (
    <Layout>
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
    </Layout>
  );
}
