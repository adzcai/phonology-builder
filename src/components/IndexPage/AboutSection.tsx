import { InputHTMLAttributes, useState } from 'react';
import fetchJson from '../../lib/fetchJson';

const TextInput = ({ name, ...props }: InputHTMLAttributes<{}>) => (
  <input
    id={name}
    name={name}
    required
    className="ml-2 pl-1.5 rounded-lg outline-none shadow focus:shadow-lg transition-shadow"
    {...props}
  />
);

type Props = {
  user: any;
  mutateUser: (data?: any, shouldRevalidate?: boolean) => Promise<any>
};

export default function AboutSection({ user, mutateUser }: Props) {
  const [formState, setFormState] = useState<'Closed' | 'Log in' | 'Sign up'>('Closed');
  const [errorMsg, setErrorMsg] = useState('');

  // when user attempts to log in
  async function handleSubmit(e) {
    e.preventDefault();

    const body: { username: string, password: string, confirmPassword?: string } = {
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value,
    };

    if (formState === 'Sign up') body.confirmPassword = e.currentTarget['confirm-password'].value;

    try {
      // will always throw error with { data: ... }
      const payload = await fetchJson(formState === 'Log in' ? '/api/login' : '/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!payload.error) {
        await mutateUser(payload);
      } else {
        setErrorMsg(payload.error.message);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      setErrorMsg(`An unexpected error occurred: ${error.message || error.data.message}`);
    }
  }

  return (
    <>
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

      {user?.isLoggedIn ? (
        <button
          type="button"
          onClick={async () => mutateUser(await fetchJson('/api/logout', { method: 'POST' }))}
          className="bg-pink-300 rounded-xl p-2"
        >
          Logout
        </button>
      ) : (
        <>
          <div className="flex space-x-8 w-max">
            <button type="button" className="rounded-xl bg-pink-300 hover:bg-pink-500 py-2 px-4 shadow-lg hover:shadow-xl transition focus:outline-none" onClick={() => setFormState('Log in')}>
              Log in
            </button>
            <button type="button" className="rounded-xl bg-pink-300 hover:bg-pink-500 py-2 px-4 shadow-lg hover:shadow-xl transition focus:outline-none" onClick={() => setFormState('Sign up')}>
              Sign up
            </button>
          </div>

          {formState !== 'Closed' && (
          <div className="bg-pink-300 w-max max-w-sm p-4 rounded-xl">
            <h3 className="font-bold text-center">{formState}</h3>

            <form onSubmit={handleSubmit} className="w-full mt-4 flex flex-col items-center space-y-4">
              <div className="grid grid-cols-2 gap-x-2 gap-y-4" style={{ gridTemplateColumns: 'auto auto' }}>
                <label htmlFor="username" className="contents">
                  <span className="text-right">Username</span>
                  <TextInput name="username" type="text" required placeholder="Enter username" />
                </label>
                <label htmlFor="password" className="contents">
                  <span className="text-right">Password</span>
                  <TextInput type="password" name="password" required placeholder="Enter password" />
                </label>
                {formState === 'Sign up' && (
                <label htmlFor="confirm-password" className="contents">
                  <span className="text-right">Confirm password</span>
                  <TextInput type="password" name="confirm-password" required placeholder="Confirm password" />
                </label>
                )}
              </div>

              <button type="submit" className="hover-blue py-2 px-4 rounded-lg shadow">{formState}</button>

              {errorMsg && <p className="text-center">{errorMsg}</p>}
            </form>
          </div>
          )}
        </>
      )}
    </>
  );
}
