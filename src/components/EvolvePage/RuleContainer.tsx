import React, {
  useState, useEffect, useContext, Dispatch, SetStateAction,
} from 'react';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { GlobalContext, useWords } from '../../lib/client/context';
import type { Matrix, Rule } from '../../lib/client/types';
import { createMatrix, createRule, insertAt } from '../../lib/client/util';
import MatrixList from './MatrixList';
import ModalButton from './ModalButton';
import PreviewEvolution from './PreviewEvolution';

type RuleEnvironmentProps = {
  preceding: Matrix[];
  setPreceding: Dispatch<SetStateAction<Matrix[]>>;
  following: Matrix[];
  setFollowing: Dispatch<SetStateAction<Matrix[]>>;
};

function RuleEnvironment({
  preceding, setPreceding, following, setFollowing,
}: RuleEnvironmentProps) {
  const buttons = [];

  if (preceding.length === 1 && preceding[0].data === 'boundary') {
    buttons.push(
      <ModalButton
        key="add-preceding-matrix"
        direction="left"
        onClick={() => setPreceding([...preceding, createMatrix()])}
      />,
    );
  }

  if (following.length === 1 && following[0].data === 'boundary') {
    buttons.push(
      <ModalButton
        key="add-following-matrix"
        direction="right"
        onClick={() => setFollowing([createMatrix(), ...following])}
      />,
    );
  }

  return (
    <>
      <span className="text-6xl font-extrabold mx-2">/</span>
      <MatrixList
        color="bg-indigo-300"
        matrices={preceding}
        setMatrices={setPreceding}
        allowWordBoundary="left"
      />
      <div className="relative">
        <span className="text-6xl font-extrabold bg-white p-2 rounded">__</span>
        {buttons}
      </div>
      <MatrixList
        color="bg-indigo-300"
        matrices={following}
        setMatrices={setFollowing}
        allowWordBoundary="right"
      />
    </>
  );
}

type Props = {
  rule: Rule;
  index: number;
  last: boolean;
  setRules: Dispatch<SetStateAction<Rule[]>>;
};

export default function RuleContainer({
  index, last, setRules, rule,
}: Props) {
  const { selectedChart } = useContext(GlobalContext);
  const { words } = useWords(selectedChart);
  const [src, setSrc] = useState<Matrix[]>(rule.src);
  const [dst, setDst] = useState<Matrix[]>(rule.dst);
  const [preceding, setPreceding] = useState<Matrix[]>(rule.preceding);
  const [following, setFollowing] = useState<Matrix[]>(rule.following);
  const [hasEnvironment, setHasEnvironment] = useState<boolean>(false);

  useEffect(() => {
    setRules((prev) => [
      ...prev.slice(0, index),
      {
        src, dst, preceding, following, id: rule.id,
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
          onClick={() => insertAt(setRules, index, createRule())}
        />
      )}

      <div className="flex items-center gap-4 p-8 overflow-auto">
        <MatrixList color="bg-yellow-300" matrices={src} setMatrices={setSrc} zeroable />
        <span className="text-6xl mx-2"><FaLongArrowAltRight /></span>
        <MatrixList color="bg-pink-300" matrices={dst} setMatrices={setDst} zeroable />
        {hasEnvironment && (
        <RuleEnvironment
          preceding={preceding}
          setPreceding={setPreceding}
          following={following}
          setFollowing={setFollowing}
        />
        )}
        <ModalButton
          direction="right"
          size="tall"
          state={hasEnvironment ? 'minus' : 'plus'}
          onClick={() => setHasEnvironment(!hasEnvironment)}
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
        onClick={() => insertAt(setRules, index + 1, createRule())}
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
