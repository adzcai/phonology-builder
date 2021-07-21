import mongoose from 'mongoose';
import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { ironSession } from 'next-iron-session';
import passport from './passport';
import '../models'; // initialize models
import { CustomRequest } from './types';

export default nextConnect()
  .use(ironSession({
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieName: 'phonology-builder/user-cookie',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  }))
  .use(async (req, res, next) => {
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
  })
  .use(passport.initialize())
  .use(passport.session());

export function authRequired(req: CustomRequest, res: NextApiResponse, next: Function) {
  if (!req.session.get('user')) {
    res.status(401).send('Unauthenticated');
  } else {
    next();
  }
}
