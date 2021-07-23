import React, { InputHTMLAttributes, useState, useCallback } from 'react';
import { useUser } from '../../lib/client/context';
import fetcher from '../../lib/client/fetcher';

const TextInput = ({ name, ...props }: InputHTMLAttributes<{}>) => (
  <input
    id={name}
    name={name}
    required
    className="ml-2 pl-1.5 rounded-lg outline-none shadow focus:shadow-lg transition-shadow"
    {...props}
  />
);

type RequestBody = {
  username: string;
  password: string;
  confirmPassword?: string;
};

export default function AuthSection() {
  const [formState, setFormState] = useState<'Closed' | 'Log in' | 'Sign up'>('Closed');
  const [errorMsg, setErrorMsg] = useState('');
  const { user, userError, mutateUser } = useUser();

  // when user attempts to log in
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const body = {
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value,
    } as RequestBody;

    if (formState === 'Sign up') body.confirmPassword = e.currentTarget['confirm-password'].value;

    try {
      // will always throw error with { data: ... }
      const url = formState === 'Log in' ? '/api/login' : '/api/signup';
      const payload = await fetcher(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await mutateUser(payload);
    } catch (error) {
      setErrorMsg(`An unexpected error occurred: ${error.info.message}`);
    }
  }, [formState]);

  if (userError) {
    return (
      <p>
        An error occurred loading data:
        {' '}
        {JSON.stringify(userError.info)}
      </p>
    );
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  if (user.isLoggedIn) {
    return (
      <div className="text-center space-y-2">
        <p>
          Logged in as
          {' '}
          {user.username}
        </p>
        <button
          type="button"
          onClick={async () => mutateUser(await fetcher('/api/logout', { method: 'POST' }))}
          className="btn-blue"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex space-x-8 w-max">
        <button type="button" className="btn-blue" onClick={() => setFormState('Log in')}>
          Log in
        </button>
        <button type="button" className="btn-blue" onClick={() => setFormState('Sign up')}>
          Sign up
        </button>
      </div>

      {formState !== 'Closed' && (
        <div className="bg-indigo-300 w-max max-w-sm p-4 rounded-xl">
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

            <button type="submit" className="btn-blue">{formState}</button>

            {errorMsg && <p className="text-center">{errorMsg}</p>}
          </form>
        </div>
      )}
    </>
  );
}
