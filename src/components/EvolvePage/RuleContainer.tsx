import React, { useState, useEffect, useContext } from 'react';
import { FaHashtag, FaLongArrowAltRight } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import { RulesContext } from '../../lib/context';
import { Matrix } from '../../lib/types';
import { createMatrix, createRule } from '../../lib/util';
import MatrixList from './MatrixList';
import ModalButton from './ModalButton';
import PreviewEvolution from './PreviewEvolution';

export default function RuleContainer({
  index, id, last,
}: {
  index: number;
  id: React.Key;
  last: boolean;
}) {
  const { words, setRules } = useContext(RulesContext);
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
        <MatrixList color="bg-pink-300" matrices={dst} setMatrices={setDst} zeroable />
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
              {preceding.length === 0
              && (
              <>
                <ModalButton direction="top-1/4 left-0" onClick={() => setPreceding([createMatrix()])} />
                <ModalButton direction="top-3/4 left-0" onClick={() => setPreceding([{ id: uuidv4(), data: 'boundary' }])}><FaHashtag /></ModalButton>
              </>
              )}
              {preceding.length === 1 && preceding[0].data === 'boundary'
              && (
                <ModalButton direction="left" onClick={() => setPreceding((prev) => [...prev, createMatrix()])} />
              )}
              <span className="text-6xl font-extrabold bg-white p-2 rounded">__</span>
              {following.length === 1 && following[0].data === 'boundary' && (
                <ModalButton direction="right" onClick={() => setFollowing((prev) => [createMatrix(), ...prev])} />
              )}
              {following.length === 0 && (
              <>
                <ModalButton direction="top-1/4 left-full" onClick={() => setFollowing([createMatrix()])} />
                <ModalButton direction="top-3/4 left-full" onClick={() => setFollowing([{ id: uuidv4(), data: 'boundary' }])}><FaHashtag /></ModalButton>
              </>
              )}
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
          ? (
            <PreviewEvolution
              words={words}
              src={src}
              dst={dst}
              preceding={preceding}
              following={following}
            />
          )
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
        <ModalButton
          direction="top-0 left-full"
          state="minus"
          onClick={() => setRules((prev) => [
            ...prev.slice(0, index),
            ...prev.slice(index + 1),
          ])}
        />
      )}
    </div>
  );
}
