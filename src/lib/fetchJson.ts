export default async function fetcher(...args): Promise<{ data?: any, error?: { message: string, data: any } }> {
  const response = await fetch(...args);

  // if status code in the 200s
  if (response.ok) {
    return response.json();
  }

  // if the server replies, there's always some data in json
  // if there's a network error, it will throw at the previous line
  const error = await response.json();
  return { error }; // will contain error from our API
}
