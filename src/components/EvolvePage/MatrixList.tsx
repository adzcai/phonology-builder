import React, { Dispatch, SetStateAction } from 'react';
import { Matrix } from '../../lib/client/types';
import FeatureMatrix from './FeatureMatrix';

// Child of RuleContainer
export default function MatrixList({
  color, matrices, setMatrices, preserveLast = true, allowWordBoundary = false, zeroable = false,
}: {
  color: string;
  matrices: Matrix[];
  setMatrices: Dispatch<SetStateAction<Matrix[]>>;
  preserveLast?: boolean;
  allowWordBoundary?: false | 'left' | 'right';
  zeroable?: boolean;
}) {
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
          deletable={!preserveLast || matrices.length > 1}
          allowWordBoundary={allowWordBoundary}
          id={id}
          key={id}
          zeroable={zeroable}
        />
      ))}
    </div>
  );
}
