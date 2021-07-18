/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import Layout from '../src/components/Layout';
import AuthSection from '../src/components/IndexPage/AuthSection';
import SonorityHierarchy from '../src/components/IndexPage/SonorityHierarchy';

export default function IndexPage() {
  return (
    <Layout>
      <p className="max-w-lg text-center">
        Based on the
        {' '}
        <a href="https://linguistics.ucla.edu/people/hayes/120a/Pheatures/" className="underline">Pheatures</a>
        {' '}
        program by UCLA.
        <br />
        This is an application made by Alexander Cai
        for exploring phonological features.
        <br />
        All functionality with diacritics is currently experimental.
        <br />
        Please report bugs or suggestions on
        {' '}
        <a href="https://github.com/pi-guy-in-the-sky/phonology-builder/issues" className="underline">
          GitHub
        </a>
        .
      </p>

      <AuthSection />

      <SonorityHierarchy />

      <h2 className="text-lg">Upcoming features</h2>
      <ul className="flex flex-col items-center space-y-2">
        <li>
          Create and save inventories
        </li>
        <li>
          Apply sound changes
        </li>
        <li>
          Play sound audio files
        </li>
      </ul>
    </Layout>
  );
}
