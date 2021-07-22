import { NextApiRequest } from 'next';

export type UserDocument = {
  username: string;
  hash: string;
  salt: string;
};

export type PhonemeDocument = {
  symbol: string;
  features: string;
};

export type EvolutionDocument = {
  _id: string;
  from: string;
  rules: {
    [key in 'src' | 'dst' | 'preceding' | 'following']: PhonemeDocument[];
  }[];
  to: string;
};

export type ChartDocument = {
  _id: string;
  username: string;
  name: string;
  sounds: PhonemeDocument[];
  words: string[];
  parent?: {
    chart: ChartDocument;
    evolutionFromParent: EvolutionDocument;
  };
};

export type CustomRequest = NextApiRequest & { session: any; user?: UserDocument };
