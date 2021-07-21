import { useContext, useState } from 'react';

import { RulesContext } from '../../lib/context';
import fetcher from '../../lib/fetchJson';

export default function WordSelector() {
  const { words, setWords, selectedChart } = useContext(RulesContext);
  const [value, setValue] = useState<string>('');
  // const [savingState, setSavingState] = useState<string>('');

  const handleSaveWords = async () => {
    const data = await fetcher(`/api/charts/${selectedChart._id}/words`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ words }),
    });

    if (data.errorMessage) {
      console.error(data.errorMessage);
    }
  };

  return (
    <div>
      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (value.length > 0 && !words.includes(value)) setWords((prev) => [...prev, value]);
          setValue('');
        }}
      >
        <label className="contents">
          <span>Word:</span>
          <input
            type="text"
            name="word"
            placeholder="Type word here"
            className="outline-none p-2 rounded"
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
          />
        </label>
        <button type="submit" className="px-4 py-2 rounded bg-blue-300 hover:bg-blue-500 transition-colors focus:outline-none">Add</button>
      </form>
      <button type="button" onClick={handleSaveWords} className="hover-blue px-4 py-2 rounded">
        Save words to current chart (
        {selectedChart ? selectedChart.name : 'none selected'}
        )
      </button>
      <ul>
        {words.map((word) => (
          <li key={word}>
            <button
              type="button"
              onClick={() => setWords((prev) => prev.filter((w) => w !== word))}
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
