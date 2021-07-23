import { allFeatures } from '../../assets/ipa-data';
import {
  Evolution,
  Features, Matrix, Rule, SerializedFeatureList,
} from '../client/types';
import {
  EvolutionDocument, PhonemeDocument, RuleDocument, RuleDocumentNoId,
} from './apiTypes';

export function serializeFeatureValue(feature) {
  return feature === 0 ? '0' : feature ? '+' : '-';
}

export function deserializeFeatureValue(feature) {
  return {
    0: 0,
    '+': true,
    '-': false,
  }[feature];
}

export function serializeFeatures(features: Partial<Features>) {
  return allFeatures
    .map(([featureName]) => (featureName in features
      ? serializeFeatureValue(features[featureName])
      : '/'))
    .join('');
}

export function deserializeFeatures(features: string): Partial<Features> {
  return allFeatures.reduce((obj, [feature], i) => {
    if (features[i] === '/') return obj;
    return { ...obj, [feature]: deserializeFeatureValue(features[i]) };
  }, {});
}

export function featureListToFeatures(
  featureList: SerializedFeatureList,
): Partial<Features> {
  return featureList.reduce(
    (obj, [feature, value]) => (feature === ''
      ? obj
      : {
        ...obj,
        [feature]: deserializeFeatureValue(value),
      }),
    {},
  );
}

export function featuresToFeatureList(
  features: Partial<Features>,
): SerializedFeatureList {
  return Object.keys(features).reduce(
    (arr, feature) => [
      ...arr,
      [feature, serializeFeatureValue(features[feature])],
    ],
    [],
  );
}

export function serializeMatrix(matrix: Matrix): Omit<PhonemeDocument, '_id'> {
  if (typeof matrix.data === 'string') return { features: matrix.data };
  return {
    // don't send the id since mongodb will generate one
    // _id: matrix.id,
    features: serializeFeatures(featureListToFeatures(matrix.data)),
  };
}

export function deserializeMatrix({ _id, features }: PhonemeDocument): Matrix {
  if (features === 'null' || features === 'boundary') return { id: _id, data: features };
  return {
    id: _id,
    data: featuresToFeatureList(deserializeFeatures(features)),
  };
}

export function deserializeRule(rule: RuleDocument): Rule {
  return {
    id: rule._id,
    src: rule.src.map(deserializeMatrix),
    dst: rule.dst.map(deserializeMatrix),
    preceding: rule.preceding.map(deserializeMatrix),
    following: rule.following.map(deserializeMatrix),
  };
}

export function serializeRule(rule: Rule): RuleDocumentNoId {
  return {
    // we don't send the id since mongodb will generate one
    // _id: rule.id,
    src: rule.src.map(serializeMatrix),
    dst: rule.dst.map(serializeMatrix),
    preceding: rule.preceding.map(serializeMatrix),
    following: rule.following.map(serializeMatrix),
  };
}

export function deserializeEvolution(evolution: EvolutionDocument): Evolution {
  return { ...evolution, rules: evolution.rules.map(deserializeRule) };
}
