export default async function fetcher(
  input: RequestInfo, init?: RequestInit,
): Promise<{ data?: any, error?: ({ message: string, data: any } | string) }> {
  const response = await fetch(input, init);

  // if status code in the 200s
  if (response.ok) {
    return response.json();
  }

  // if the server replies, there's always some data in json
  // if there's a network error, it will throw at the previous line
  const error = await (response.status >= 500 && response.status < 600
    ? response.text() : response.json());
  return { error }; // will contain error from our API
}
