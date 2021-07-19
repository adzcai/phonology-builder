import {
  Dispatch, SetStateAction, useEffect, useState,
} from 'react';
import {
  FaLongArrowAltRight, FaMinus, FaPlus,
} from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import useSWR from 'swr';
import FeatureSelector from '../src/components/FilterFeaturesPage/FeatureSelector';
import Layout from '../src/components/Layout';
import UserCharts from '../src/components/SelectSoundsPage/UserCharts';
import { Condition, Features, SerializedFeatureList } from '../src/lib/types';
import {
  allSounds, featureListToFeatures, filterSounds, matchConditions,
} from '../src/assets/ipa-data';

type Matrix = {
  data: SerializedFeatureList,
  id: React.Key
};

type Rule = {
  src: Matrix[];
  dst: Matrix[];
  preceding: Matrix[];
  following: Matrix[];
  id: React.Key;
};

const createRule = (): Rule => ({
  src: [], dst: [], preceding: [], following: [], id: uuidv4(),
});

const createMatrix = (): Matrix => ({
  data: [['', null]], id: uuidv4(),
});

const FeatureMatrix = ({
  setMatrices, index, color, isEnd, id,
}: {
  setMatrices: Dispatch<SetStateAction<Matrix[]>>,
  index: number,
  color: string,
  isEnd: boolean,
  id: React.Key
}) => {
  const [features, setFeatures] = useState<SerializedFeatureList>([['', null]]);

  // whenever we update the features using the FeatureSelector,
  // update the MatrixList that this feature matrix is a part of
  useEffect(() => {
    setMatrices((prev) => [
      ...prev.slice(0, index),
      { id, data: features },
      ...prev.slice(index + 1),
    ]);
  }, [features]);

  return (
    <div className={`relative ${color} shadow-xl p-4 rounded-lg`}>
      <FeatureSelector
        features={features}
        setFeatures={setFeatures}
        buttonLabel={<FaPlus />}
        groupName={id}
        flexDirection="col"
      />
      <button
        type="button"
        title="add feature matrix"
        onClick={() => {
          setMatrices((prev) => [...prev.slice(0, index), createMatrix(), ...prev.slice(index)]);
        }}
        className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 p-1 text-sm bg-green-300 rounded-xl focus:outline-none hover:bg-green-500 transition-colors"
      >
        <FaPlus />
      </button>
      {isEnd && (
      <button
        type="button"
        title="add feature matrix"
        onClick={() => {
          setMatrices((prev) => [...prev, createMatrix()]);
        }}
        className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 p-1 text-sm bg-green-300 rounded-xl focus:outline-none hover:bg-green-500 transition-colors"
      >
        <FaPlus />
      </button>
      )}
      <button
        type="button"
        title="remove this feature matrix"
        onClick={() => setMatrices((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)])}
        className="absolute top-0 right-0 z-10 transform translate-x-1/2 -translate-y-1/2 p-1 text-sm bg-red-300 rounded-xl focus:outline-none hover:bg-red-500 transition-colors"
      >
        <FaMinus />
      </button>
    </div>
  );
};

const MatrixList = ({ color, matrices, setMatrices }: {
  color: string,
  matrices: Matrix[],
  setMatrices: Dispatch<SetStateAction<Matrix[]>>
}) => (
  <div className="flex">
    {matrices.map(({ id }, i) => (
      <FeatureMatrix
        color={color}
        setMatrices={setMatrices}
        index={i}
        isEnd={i === matrices.length - 1}
        id={id}
        key={id}
      />
    ))}
  </div>
);

const findIndexOfMatrices = (str: Features[], matrices: Condition[], startIndex = 0) => {
  const n = matrices.length;
  if (n + startIndex >= str.length) return -1;

  for (let i = startIndex; i + n <= str.length; ++i) {
    let match = true;
    for (let j = 0; j < n; ++j) {
      if (!matchConditions(str[i + j], matrices[j])) {
        match = false;
        break;
      }
    }
    if (match) return i;
  }

  return -1;
};

const RuleComponent = ({
  setRules, index, words, id, last,
}: {
  setRules: Dispatch<SetStateAction<Rule[]>>;
  index: number;
  words: string[];
  id: React.Key;
  last: boolean;
}) => {
  const [src, setSrc] = useState<Matrix[]>([createMatrix()]);
  const [dst, setDst] = useState<Matrix[]>([createMatrix()]);
  const [preceding, setPreceding] = useState<Matrix[]>([]);
  const [following, setFollowing] = useState<Matrix[]>([]);

  useEffect(() => {
    setRules((prev) => [
      ...prev.slice(0, index),
      {
        src, dst, preceding, following, id,
      },
      ...prev.slice(index + 1),
    ]);
  }, [src, dst, preceding, following]);

  return (
    <div className="relative container">
      <div className="flex bg-gray-200 items-center gap-4 shadow-xl p-8 border-gray-300 border-4 overflow-auto">
        <MatrixList color="bg-yellow-300" matrices={src} setMatrices={setSrc} />
        <span className="text-6xl mx-2"><FaLongArrowAltRight /></span>
        <MatrixList color="bg-purple-300" matrices={dst} setMatrices={setDst} />
        <span className="text-6xl font-extrabold mx-2">/</span>
        <MatrixList color="bg-indigo-300" matrices={preceding} setMatrices={setPreceding} />
        <span className="text-6xl font-extrabold mx-2">__</span>
        <MatrixList color="bg-indigo-300" matrices={following} setMatrices={setFollowing} />
      </div>
      <div>
        {src.length === dst.length
          ? (
            <ul>
              {words.map((word) => {
                // turn word into a list of feature matrices
                const str = word.split('').map((char) => allSounds.find((segment) => segment.symbol === char).features);
                const matrices = src.map((matrix) => featureListToFeatures(matrix.data));
                const dstMatrices = dst.map((matrix) => featureListToFeatures(matrix.data));
                const foundIndex = findIndexOfMatrices(str, matrices);

                if (foundIndex < 0) {
                  return (
                    <li>
                      {word}
                      {' '}
                      not found
                    </li>
                  );
                }

                const displayWord = [
                  word.slice(0, foundIndex),
                  <span className="bg-green-100">{word.substr(foundIndex, matrices.length)}</span>,
                  word.slice(foundIndex + matrices.length),
                ];

                const replacement = str.slice(foundIndex, foundIndex + matrices.length)
                  .map((features, i) => {
                    console.log(i, dstMatrices[i]);
                    const matchingSounds = filterSounds(allSounds, {
                      ...features,
                      ...dstMatrices[i],
                    });
                    if (matchingSounds.length === 0) return '?';
                    return matchingSounds[0].symbol;
                  }).join('');

                const newStr = (word.slice(0, foundIndex)
                  + replacement + word.slice(foundIndex + matrices.length))
                  .split('')
                  .map((char, i) => (
                    <span
                      className="hover:bg-white transition-colors"
                      title={JSON.stringify(str[i])}
                    >
                      {char}
                    </span>
                  ));

                return (
                  <li key={word}>
                    {displayWord}
                    {' '}
                    became
                    {' '}
                    {newStr}
                  </li>
                );
              })}
            </ul>
          ) : 'Make sure there are the same number of source and destination matrices'}
      </div>
      {index === 0 && (
      <button
        type="button"
        onClick={() => setRules((prev) => [
          ...prev.slice(0, index),
          createRule(),
          ...prev.slice(index),
        ])}
        className="absolute z-10 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transform bg-green-300 p-3 hover:bg-green-500 rounded-xl transition-colors focus:outline-none"
      >
        <FaPlus />
      </button>
      )}
      <button
        type="button"
        onClick={() => setRules((prev) => [
          ...prev.slice(0, index + 1),
          createRule(),
          ...prev.slice(index + 1),
        ])}
        className="absolute z-10 bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 transform bg-green-300 p-3 hover:bg-green-500 rounded-xl transition-colors focus:outline-none"
      >
        <FaPlus />
      </button>
      {!last && (
      <button
        type="button"
        onClick={() => setRules((prev) => [
          ...prev.slice(0, index),
          ...prev.slice(index + 1),
        ])}
        className="absolute z-10 top-0 right-0 translate-x-1/2 -translate-y-1/2 transform bg-red-300 p-3 hover:bg-red-500 rounded-xl transition-colors focus:outline-none"
      >
        <FaMinus />
      </button>
      )}
    </div>
  );
};

const WordSelector = ({ words, setWords }: {
  words: string[],
  setWords: Dispatch<SetStateAction<string[]>>
}) => {
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
};

export default function EvolvePage() {
  const { data: user } = useSWR('/api/user');

  const [words, setWords] = useState<string[]>([]);
  const [rules, setRules] = useState<Rule[]>([createRule()]);

  if (!user?.data) return <Layout>Loading...</Layout>;

  if (!user.data.isLoggedIn) return <Layout>User must be logged in!</Layout>;

  return (
    <Layout>
      <UserCharts />

      <WordSelector words={words} setWords={setWords} />

      <div className="relative flex flex-col">
        {rules.map(({ id }, i) => (
          <RuleComponent
            setRules={setRules}
            index={i}
            words={words}
            key={id}
            id={id}
            last={rules.length === 1}
          />
        ))}
      </div>
    </Layout>
  );
}
