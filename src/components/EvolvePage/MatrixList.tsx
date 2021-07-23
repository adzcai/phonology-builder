import React, { Dispatch, SetStateAction } from 'react';
import { FaHashtag, FaPlus } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import type { Matrix } from '../../lib/client/types';
import { createMatrix } from '../../lib/client/util';
import FeatureMatrix from './FeatureMatrix';

type Props = {
  color: string;
  matrices: Matrix[];
  setMatrices: Dispatch<SetStateAction<Matrix[]>>;
  allowWordBoundary?: false | 'left' | 'right';
  zeroable?: boolean;
};

// Child of RuleContainer
export default function MatrixList({
  color, matrices, setMatrices, allowWordBoundary = false, zeroable = false,
}: Props) {
  if (matrices.length === 0) {
    return (
      <div className="flex flex-col">
        <button
          type="button"
          title="Create a feature set"
          onClick={() => setMatrices([createMatrix()])}
          className={`${color} p-3 rounded shadow focus:outline-none`}
        >
          <FaPlus />
        </button>
        {allowWordBoundary && (
        <button
          type="button"
          title="Insert a word boundary"
          onClick={() => setMatrices([{ id: uuidv4(), data: 'boundary' }])}
          className={`${color} p-3 rounded shadow focus:outline-none`}
        >
          <FaHashtag />
        </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {matrices.map(({ data, id }, i) => (
        <FeatureMatrix
          color={color}
          setMatrices={setMatrices}
          matrix={data}
          index={i}
          isLeftmostFeatureMatrix={i === 0 || (i === 1 && matrices[0].data === 'boundary')}
          isRightmost={i === matrices.length - 1}
          allowWordBoundary={allowWordBoundary}
          id={id}
          key={id}
          zeroable={zeroable}
        />
      ))}
    </div>
  );
}
