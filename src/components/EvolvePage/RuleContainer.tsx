import React, {
  Dispatch, SetStateAction, useState, useEffect,
} from 'react';
import { FaLongArrowAltRight, FaMinus } from 'react-icons/fa';
import { Matrix, Rule } from '../../lib/types';
import { createMatrix, createRule } from '../../lib/util';
import MatrixList from './MatrixList';
import ModalButton from './ModalButton';
import PreviewEvolution from './PreviewEvolution';

export default function RuleContainer({
  setRules, index, words, id, last,
}: {
  setRules: Dispatch<SetStateAction<Rule[]>>;
  index: number;
  words: string[];
  id: React.Key;
  last: boolean;
}) {
  const [src, setSrc] = useState<Matrix[]>([createMatrix()]);
  const [dst, setDst] = useState<Matrix[]>([createMatrix()]);
  const [preceding, setPreceding] = useState<Matrix[]>([]);
  const [following, setFollowing] = useState<Matrix[]>([]);
  const [hasEnvironment, setHasEnvironment] = useState<boolean>(false);

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
    <div className="relative container bg-gray-200 shadow-xl border-gray-300 border-4">
      {index === 0 && (
        <ModalButton
          direction="top"
          size="lg"
          onClick={() => setRules((prev) => [
            ...prev.slice(0, index),
            createRule(),
            ...prev.slice(index),
          ])}
        />
      )}
      <div className="flex items-center gap-4 p-8 overflow-auto">
        <MatrixList color="bg-yellow-300" matrices={src} setMatrices={setSrc} zeroable />
        <span className="text-6xl mx-2"><FaLongArrowAltRight /></span>
        <MatrixList color="bg-purple-300" matrices={dst} setMatrices={setDst} zeroable />
        {hasEnvironment && (
          <>
            <span className="text-6xl font-extrabold mx-2">/</span>
            <MatrixList
              color="bg-indigo-300"
              preserveLast={false}
              matrices={preceding}
              setMatrices={setPreceding}
              allowWordBoundary="left"
            />
            <div className="relative">
              {preceding.length === 0 && <ModalButton direction="left" onClick={() => setPreceding((prev) => [...prev, createMatrix()])} />}
              <span className="text-6xl font-extrabold bg-white p-2 rounded">__</span>
              {following.length === 0 && <ModalButton direction="right" onClick={() => setFollowing((prev) => [createMatrix(), ...prev])} />}
            </div>
            <MatrixList
              color="bg-indigo-300"
              preserveLast={false}
              matrices={following}
              setMatrices={setFollowing}
              allowWordBoundary="right"
            />
          </>
        )}
        <ModalButton
          direction="right"
          size="tall"
          state={hasEnvironment ? 'minus' : 'plus'}
          onClick={() => setHasEnvironment((prev) => !prev)}
        />
      </div>
      <div className="px-8 pb-8">
        <h3 className="font-bold">Word evolution</h3>
        {src.length === dst.length
          ? <PreviewEvolution words={words} src={src} dst={dst} />
          : (
            <p>
              Make sure there are the same number of source and destination matrices to enable live
              evolution preview!
            </p>
          )}
      </div>
      <ModalButton
        direction="bottom"
        size="lg"
        onClick={() => setRules((prev) => [
          ...prev.slice(0, index + 1),
          createRule(),
          ...prev.slice(index + 1),
        ])}
      />
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
}
