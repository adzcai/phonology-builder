import { ChartDocument } from '../api/apiTypes';

type LoginEndpoint = {
  url: '/api/login';
  result: {
    isLoggedIn: true;
    username: string;
  };
};

type SignupEndpoint = {
  url: '/api/signup';
  result: {
    isLoggedIn: true;
    username: string;
  };
};

type LogoutEndpoint = {
  url: '/api/logout',
  result: {
    isLoggedIn: false;
  };
};

type UserEndpoint = {
  url: '/api/user';
  result: {
    isLoggedIn: true;
    username: string;
  };
};

type ChartsUsernameEndpoint = {
  url: `/api/charts/${string}`;
  result: ChartDocument[];
};

type ChartsUsernameChartnameWords = {
  url: `/api/charts/${string}/${string}/words`;
  result: string[];
};

type ErrorPayload = Error & {
  info: {
    message: string;
  };
  status: number;
};

// Client side fetcher utility function.
export default async function fetcher(url: RequestInfo, init?: RequestInit) {
  const res = await fetch(url, init);

  // if the server replies, there's always some data in json
  // if there's a network error, it will throw at the previous line
  if (!res.ok) {
    const error = new Error(`The request to ${url} returned a non-ok status ${res.status}`) as ErrorPayload;
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export function postJson(url: RequestInfo, json: object) {
  return fetcher(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(json),
  });
}
