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
  rules: {
    [key in 'src' | 'dst' | 'preceding' | 'following']: PhonemeDocument[];
  }[];
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
