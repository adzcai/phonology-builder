import passport from 'passport';
import Local from 'passport-local';
import mongoose from 'mongoose';
import { UserDocument } from './apiTypes';
import { validatePassword } from './user';

passport.serializeUser((user: UserDocument, done) => done(null, user.username));

passport.deserializeUser(async (req, username, done) => {
  const user = await mongoose.model('User').findOne({ username });
  done(null, user);
});

passport.use(new Local.Strategy(async (
  username,
  password,
  done,
) => {
  try {
    const user = await mongoose.model('User').findOne({ username });
    if (user && validatePassword(user, password)) {
      done(null, user);
    } else {
      done(new Error('Invalid username and password combination'));
    }
  } catch (error) {
    done(error);
  }
}));

export default passport;
