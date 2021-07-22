import React, {
  Dispatch, SetStateAction, useState, useEffect,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  FaHashtag, FaPlus, FaCreativeCommonsZero, FaWindowMaximize,
} from 'react-icons/fa';
import { Matrix, RuleComponent } from '../../lib/client/types';
import { createMatrix } from '../../lib/client/util';
import FeatureSelector from '../FilterFeaturesPage/FeatureSelector';
import ModalButton from './ModalButton';

type Props = {
  setMatrices: Dispatch<SetStateAction<Matrix[]>>;
  matrix: RuleComponent,
  index: number;
  color: string;
  isLeftmostFeatureMatrix: boolean;
  isRightmost: boolean;
  deletable: boolean;
  id: React.Key;
  allowWordBoundary: false | 'left' | 'right';
  zeroable?: boolean;
};

// child of MatrixList
export default function FeatureMatrix({
  setMatrices, matrix, index, color, isLeftmostFeatureMatrix, isRightmost,
  id, deletable, allowWordBoundary, zeroable = false,
}: Props) {
  const [features, setFeatures] = useState<RuleComponent>(matrix);

  // whenever we update the features using the FeatureSelector,
  // update the MatrixList that this feature matrix is a part of
  useEffect(() => {
    setMatrices((prev) => [
      ...prev.slice(0, index),
      { id, data: features },
      ...prev.slice(index + 1),
    ]);
  }, [features]);

  const insertAt = (idx: number, obj: Matrix) => setMatrices((prev) => [
    ...prev.slice(0, idx), obj, ...prev.slice(idx),
  ]);

  const isBoundary = features === 'boundary';
  const canInsertBoundaryLeft = allowWordBoundary === 'left' && index === 0 && !isBoundary;
  const canInsertBoundaryRight = allowWordBoundary === 'right' && isRightmost && !isBoundary;

  const buttons = [];

  if (isLeftmostFeatureMatrix && !isBoundary) {
    buttons.push(
      <ModalButton
        direction={canInsertBoundaryLeft ? 'left-0 top-1/4' : 'left'}
        onClick={() => insertAt(index, createMatrix())}
        key="left-add-matrix-button"
      />,
    );
  }

  if (!isBoundary) {
    buttons.push(
      <ModalButton
        direction={canInsertBoundaryRight ? 'left-full top-1/4' : 'right'}
        onClick={() => setMatrices((prev) => [...prev, createMatrix()])}
        key="right-add-matrix-button"
      />,
    );
  }

  if (canInsertBoundaryLeft) {
    buttons.push(
      <ModalButton
        direction="left-0 top-2/3"
        size="tall"
        onClick={() => insertAt(index, { id: uuidv4(), data: 'boundary' })}
        key="left-add-boundary-button"
      >
        <FaHashtag />
      </ModalButton>,
    );
  }

  if (canInsertBoundaryRight) {
    buttons.push(
      <ModalButton
        direction="left-full top-2/3"
        size="tall"
        onClick={() => insertAt(index + 1, { id: uuidv4(), data: 'boundary' })}
        key="right-add-boundary-button"
      >
        <FaHashtag />
      </ModalButton>,
    );
  }

  if (deletable) {
    buttons.push(
      <ModalButton
        state="minus"
        direction="top-0 left-full"
        onClick={() => setMatrices((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)])}
        key="delete-button"
      />,
    );
  }

  if (zeroable) {
    buttons.push(
      <ModalButton
        direction="bottom"
        state={typeof features === 'string' ? 'plus' : 'minus'}
        onClick={() => setFeatures(features === 'null' ? [['', null]] : 'null')}
        key="zero-button"
      >
        {typeof features === 'string'
          ? <FaWindowMaximize />
          : <FaCreativeCommonsZero />}
      </ModalButton>,
    );
  }

  return (
    <div className={`relative ${color} shadow-xl p-4 rounded-lg`}>
      {features === 'null'
        ? <FaCreativeCommonsZero />
        : features === 'boundary'
          ? <FaHashtag />
          : (
            <FeatureSelector
              features={features}
              setFeatures={setFeatures}
              buttonLabel={<FaPlus />}
              groupName={id}
              flexDirection="col"
            />
          )}
      {buttons}
    </div>
  );
}
