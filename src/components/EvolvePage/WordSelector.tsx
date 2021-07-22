import { useContext } from 'react';
import useSWR from 'swr';

import { RulesContext } from '../../lib/client/context';
import fetcher from '../../lib/client/fetcher';

export default function WordSelector() {
  const { selectedChart } = useContext(RulesContext);
  const { data: words, mutate: mutateWords, error } = useSWR(() => `/api/charts/${selectedChart._id}/words`);

  if (!selectedChart) {
    return <p>Select a chart to save words!</p>;
  }

  if (error) {
    return (
      <p>
        An error occurred fetching the words from the current chart:
        {' '}
        {error.info.message}
      </p>
    );
  }

  if (!words) {
    return <p>Loading...</p>;
  }

  const handleAddWord = async (e) => {
    e.preventDefault();

    const { value } = e.currentTarget.word;
    e.currentTarget.word.value = '';

    if (value.length > 0 && !words.includes(value)) {
      try {
        const newWords = [...words, value];
        await mutateWords(newWords);
        await fetcher(`/api/charts/${selectedChart._id}/words`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ words: newWords }),
        });
        await mutateWords();
      } catch (err) {
        console.error(err.info.message);
      }
    }
  };

  return (
    <div>
      <form className="flex items-center gap-2" onSubmit={handleAddWord}>
        <label className="contents">
          <span>Word:</span>
          <input
            type="text"
            name="word"
            placeholder="Type word here"
            className="outline-none p-2 rounded"
          />
        </label>
        <button type="submit" className="px-4 py-2 rounded bg-blue-300 hover:bg-blue-500 transition-colors focus:outline-none">Add</button>
      </form>
      <button type="button" className="hover-blue px-4 py-2 rounded">
        Save words to current chart (
        {selectedChart ? selectedChart.name : 'none selected'}
        )
      </button>

      <ul>
        {words.map((word) => (
          <li key={word}>
            <button
              type="button"
              onClick={async () => {
                const newWords = words.filter((w) => w !== word);
                await mutateWords(newWords);
                await fetcher(`/api/charts/${selectedChart._id}/words`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ words: newWords }),
                });
                await mutateWords();
              }}
              className="hover:line-through"
            >
              {word}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
