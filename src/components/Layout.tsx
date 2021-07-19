import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

const paths = [
  {
    path: '/',
    color: 'bg-pink-300',
    title: 'About',
  },
  {
    path: '/select-sounds',
    color: 'bg-red-300',
    title: 'Choose sounds',
  },
  {
    path: '/view-inventory',
    color: 'bg-yellow-100',
    title: 'View inventory',
  },
  {
    path: '/compare-sounds',
    color: 'bg-green-300',
    title: 'Compare sounds',
  },
  {
    path: '/filter-transform',
    color: 'bg-blue-300',
    title: 'Filter and transform sounds',
  },
  {
    path: '/evolve',
    color: 'bg-indigo-300',
    title: 'Evolve phonology',
  },
];

export default function Layout({ children }) {
  const router = useRouter();

  const { color, title } = paths.find(({ path }) => path === router.pathname);

  return (
    <div className="min-h-screen bg-blue-300">
      <Head>
        <title>
          Phonology Builder
          {title ? ` | ${title}` : ''}
        </title>
      </Head>

      <header className="p-8 md:py-12 bg-gradient-to-br from-purple-300 to-indigo-300 w-full flex flex-col items-center space-y-8">
        <h1 className="text-4xl text-center">Phonetic Inventory Builder</h1>
      </header>
      <nav className="bg-indigo-800 md:bg-gradient-to-tr from-purple-300 to-indigo-300 p-8 md:p-0">
        {/* MANUALLY CHANGE GRID COLS WHEN PATHS CHANGES */}
        <ul className="grid items-stretch grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 md:gap-0">
          {paths.map(({ path, color: liColor, title: liTitle }) => (
            <Link key={path} href={path}>
              <a href={path} className="contents">
                <li className={`text-center p-2 rounded-2xl md:rounded-b-none ${liColor}`}>{liTitle}</li>
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
