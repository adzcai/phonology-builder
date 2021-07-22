import mongoose from 'mongoose';
import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { ironSession } from 'next-iron-session';
import passport from './passport';
import { asyncHandler } from './asyncHandler';
import { CustomRequest, UserDocument } from './apiTypes';

export const withAuth = nextConnect()
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

export const authRequired = nextConnect()
  .use(withAuth)
  .use(asyncHandler(async (req: CustomRequest, res: NextApiResponse, next: Function) => {
    if (!req.session.get('user')?.username) {
      res.status(401).json({ message: 'Unauthenticated' });
    } else {
      const { username } = req.session.get('user');
      const user = await mongoose.model<UserDocument>('User').findOne({ username }).exec();
      if (!user) res.status(401).json({ message: 'User not found' });
      else {
        req.user = user;
        next();
      }
    }
  }));
