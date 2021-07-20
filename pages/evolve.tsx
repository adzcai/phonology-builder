import useSWR from 'swr';
import React, { useState } from 'react';
import Layout from '../src/components/Layout';
import UserCharts from '../src/components/SelectSoundsPage/UserCharts';
import RuleComponent from '../src/components/EvolvePage/RuleComponent';
import WordSelector from '../src/components/EvolvePage/WordSelector';
import { RuleWithId } from '../src/lib/types';
import { createRule } from '../src/lib/util';

export default function EvolvePage() {
  const { data: user } = useSWR('/api/user');

  const [words, setWords] = useState<string[]>([]);
  const [rules, setRules] = useState<RuleWithId[]>([createRule()]);

  if (!user?.data) return <Layout>Loading...</Layout>;

  if (!user.data.isLoggedIn) return <Layout>User must be logged in!</Layout>;

  return (
    <Layout>
      <UserCharts />

      <WordSelector words={words} setWords={setWords} />

      <div className="relative flex flex-col">
        {rules.map(({ id }, i) => (
          <RuleComponent
            setRules={setRules}
            index={i}
            words={words}
            key={id}
            id={id}
            last={rules.length === 1}
          />
        ))}
      </div>
    </Layout>
  );
}
