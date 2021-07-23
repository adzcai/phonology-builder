import { NextApiRequest } from 'next';

// all types ending with "Document"
// encode the way the data is stored in the database,
// which may differ from how it is returned from an endpoint
// or how it is used on the client

export type UserDocument = {
  _id: string;
  username: string;
  hash: string;
  salt: string;
};

export type PhonemeDocument = {
  _id: string;
  symbol?: string;
  features: string; // the encoded features or 'boundary' or 'null' in a rule
};

type RuleGeneric<T> = {
  _id: string;
  src: T[];
  dst: T[];
  preceding?: T[];
  following?: T[];
};

// not sure if this has an id since it only appears as a child of a list
export type RuleDocument = RuleGeneric<PhonemeDocument>;

export type RuleDocumentNoId = Omit<RuleGeneric<Omit<PhonemeDocument, '_id'>>, '_id'>;

// Essentially an arrow between two languages
// contains a list of phonological rules
export type EvolutionDocument = {
  _id: string;
  from: string;
  to: string;
  rules: RuleDocument[];
};

// TODO rename to LanguageDocument
export type ChartDocument = {
  _id: string;
  username: string;
  name: string;
  sounds: PhonemeDocument[];
  words: string[];
};

export type CustomRequest = NextApiRequest & {
  session: any;
  user?: UserDocument;
  evolution?: EvolutionDocument;
};
