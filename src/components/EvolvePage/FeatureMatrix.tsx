import React, {
  Dispatch, SetStateAction, useState, useEffect,
} from 'react';
import { FaHashtag, FaPlus, FaMinus } from 'react-icons/fa';
import { Matrix, SerializedFeatureList } from '../../lib/types';
import { createMatrix } from '../../lib/util';
import FeatureSelector from '../FilterFeaturesPage/FeatureSelector';
import ModalButton from './ModalButton';

export default function FeatureMatrix({
  setMatrices, index, color, isRightmost, id, deletable, allowWordBoundary,
}: {
  setMatrices: Dispatch<SetStateAction<Matrix[]>>;
  index: number;
  color: string;
  isRightmost: boolean;
  deletable: boolean;
  id: React.Key;
  allowWordBoundary: false | 'left' | 'right';
}) {
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
      {index === 0 && (
        <ModalButton
          direction={allowWordBoundary === 'left' && index === 0 ? 'left-0 top-1/4' : 'left'}
          onClick={() => {
            setMatrices((prev) => [...prev.slice(0, index), createMatrix(), ...prev.slice(index)]);
          }}
        />
      )}

      {allowWordBoundary === 'left' && index === 0 && (
        <ModalButton
          direction="left-0 top-2/3"
          size="tall"
          onClick={() => {
            alert('tried to insert word boundary');
          }}
        >
          <FaHashtag />
        </ModalButton>
      )}

      <FeatureSelector
        features={features}
        setFeatures={setFeatures}
        buttonLabel={<FaPlus />}
        groupName={id}
        flexDirection="col"
      />

      <ModalButton
        direction={allowWordBoundary === 'right' && isRightmost ? 'left-full top-1/4' : 'right'}
        onClick={() => {
          setMatrices((prev) => [...prev, createMatrix()]);
        }}
      />

      {allowWordBoundary === 'right' && isRightmost && (
      <ModalButton
        direction="left-full top-2/3"
        size="tall"
        onClick={() => {
          alert('tried to insert word boundary');
        }}
      >
        <FaHashtag />
      </ModalButton>
      )}

      {deletable && (
        <button
          type="button"
          title="remove this feature matrix"
          onClick={() => setMatrices((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)])}
          className="absolute top-0 right-0 z-10 transform translate-x-1/2 -translate-y-1/2 p-1 text-sm bg-red-300 rounded-xl focus:outline-none hover:bg-red-500 transition-colors"
        >
          <FaMinus />
        </button>
      )}
    </div>
  );
}
