import React, { Dispatch, SetStateAction } from 'react';
import { Matrix } from '../../lib/types';
import FeatureMatrix from './FeatureMatrix';

export default function MatrixList({
  color, matrices, setMatrices, preserveLast = true, allowWordBoundary = false,
}: {
  color: string;
  matrices: Matrix[];
  setMatrices: Dispatch<SetStateAction<Matrix[]>>;
  preserveLast?: boolean;
  allowWordBoundary?: false | 'left' | 'right';
}) {
  return (
    <div className="flex">
      {matrices.map(({ id }, i) => (
        <FeatureMatrix
          color={color}
          setMatrices={setMatrices}
          index={i}
          isRightmost={i === matrices.length - 1}
          deletable={!preserveLast || matrices.length > 1}
          allowWordBoundary={allowWordBoundary}
          id={id}
          key={id}
        />
      ))}
    </div>
  );
}
