import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';

const paths = [
  {
    path: '/',
    color: 'bg-pink-300',
    gradient: 'to-pink-300',
    title: 'About',
  },
  {
    path: '/select-sounds',
    color: 'bg-red-300',
    gradient: 'to-red-300',
    title: 'Select sounds',
  },
  {
    path: '/view-inventory',
    color: 'bg-yellow-200',
    gradient: 'to-yellow-200',
    title: 'View inventory',
  },
  {
    path: '/compare-sounds',
    color: 'bg-green-300',
    gradient: 'to-green-300',
    title: 'Compare sounds',
  },
  {
    path: '/filter-transform',
    color: 'bg-blue-300',
    gradient: 'to-blue-300',
    title: 'Filter and transform sounds',
  },
  {
    path: '/evolve',
    color: 'bg-indigo-300',
    gradient: 'to-indigo-300',
    title: 'Evolve phonology',
  },
];

export default function Layout({ children }: PropsWithChildren<{}>) {
  const router = useRouter();

  const { color, title, gradient } = paths.find(({ path }) => path === router.pathname) || { color: 'bg-black', title: 'Error', gradient: 'to-black' };

  return (
    <div className="min-h-screen bg-blue-300">
      <Head>
        <title>
          Phonology Builder
          {title ? ` | ${title}` : ''}
        </title>
      </Head>

      <header className={`p-8 md:py-12 bg-gradient-to-b from-indigo-300 via-indigo-300 ${gradient} w-full`}>
        <h1>Phonetic Inventory Builder</h1>
      </header>

      <nav className={`p-8 md:p-0 ${color}`}>
        {/* MANUALLY CHANGE GRID COLS WHEN PATHS CHANGES */}
        <ul className="grid items-stretch grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 md:gap-0">
          {paths.map(({ path, color: liColor, title: liTitle }) => (
            <Link key={path} href={path}>
              <a href={path} className="contents">
                <li className={`text-center p-2 rounded-2xl md:rounded-b-none ${liColor} ${path === router.pathname && 'font-bold text-xl'}`}>{liTitle}</li>
              </a>
            </Link>
          ))}
        </ul>
      </nav>

      <main className={`py-8 px-4 flex flex-col space-y-8 items-center ${color}`}>
        <h2 className="text-center text-2xl">{title}</h2>
        {children}
      </main>

      <footer className="p-4">
        <p className="text-center py-2 max-w-md mx-auto">
          Made by Alexander Cai (c) May 2021 under the MIT License.
          Built with Next.js and Tailwind CSS.
          {' '}
          <a href="https://github.com/pi-guy-in-the-sky/phonology-builder" className="underline">GitHub here.</a>
        </p>
      </footer>
    </div>
  );
}
