export default async function fetcher(...args) {
  try {
    const response = await fetch(...args);

    if (response.ok) {
      return await response.json();
    }

    // if the server replies, there's always some data in json
    // if there's a network error, it will throw at the previous line
    const data = response.status === 500 ? await response.text() : await response.json();

    const error = new Error(response.statusText);
    error.response = response;
    error.data = data;
    throw error;
  } catch (error) {
    if (!error.data) {
      error.data = { message: error.message };
    }
    throw error;
  }
}
