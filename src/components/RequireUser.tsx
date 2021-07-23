import React from 'react';
import { useUser } from '../lib/client/context';

type Props = React.PropsWithChildren<{
  message?: React.ReactNode;
}>;

export default function RequireUser({ children, message = 'You must be logged in to view this!' }: Props) {
  const { user, userError } = useUser();

  if (userError) {
    return (
      <p>
        An error occurred when loading the user:
        {' '}
        <pre>
          {userError.info.message}
        </pre>
      </p>
    );
  }

  if (!user) return <p>Loading...</p>;
  if (!user.isLoggedIn) return <p>{message}</p>;
  if (typeof children === 'string') return <p>children</p>;

  return <>{children}</>;
}
