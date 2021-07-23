import { NextApiResponse } from 'next';
import nextConnect, { Middleware } from 'next-connect';
import { ironSession } from 'next-iron-session';
import mongoose from 'mongoose';
import passport from 'passport';
import { EvolutionModel } from '../../models';
import { CustomRequest, UserDocument } from './apiTypes';

export function asyncHandler(fn: Middleware<CustomRequest, NextApiResponse>) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

export function onError(err, req, res, next) {
  console.error('internal server error (onError):', err);

  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ message: err.message });
}

export const createEndpoint = () => nextConnect({ onError })
  .use(ironSession({
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieName: 'phonology-builder/user-cookie',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  }))
  .use(asyncHandler(async (req, res, next) => {
    // check if we have a connection to the database or if it's currently
    // connecting or disconnecting (readyState 1, 2 and 3)
    if (mongoose.connection.readyState < 1) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      });
    }
    next();
  }))
  .use(passport.initialize())
  .use(passport.session());

export const authRequired = asyncHandler(
  async (req: CustomRequest, res: NextApiResponse, next: Function) => {
    if (!req.session.get('user')?.username) {
      res.status(401).json({ message: 'Unauthenticated' });
    } else {
      const { username } = req.session.get('user');
      const user = await mongoose.model<UserDocument>('User').findOne({ username }).exec();
      if (!user) {
        res.status(401).json({ message: 'User not found' });
      } else {
        req.user = user;
        next();
      }
    }
  },
);

export const withEvolution = (lean: boolean) => asyncHandler(async (req, res, next) => {
  const evolution = lean
    ? await EvolutionModel.findById(req.query.id).lean().exec()
    : await EvolutionModel.findById(req.query.id).exec();
  if (!evolution) {
    res.status(404).json({ message: `Evolution with id ${req.query.id} not found` });
  } else {
    req.evolution = evolution;
    next();
  }
});
