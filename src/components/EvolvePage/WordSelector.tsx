import { Dispatch, SetStateAction, useState } from 'react';

export default function WordSelector({ words, setWords }: {
  words: string[],
  setWords: Dispatch<SetStateAction<string[]>>
}) {
  const [value, setValue] = useState<string>('');

  return (
    <div>
      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setValue('');
          if (!words.includes(value)) setWords((prev) => [...prev, value]);
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
