import passport from 'passport';
import Local from 'passport-local';
import { UserPayload } from '../assets/ipa-data';
import User from '../models/User';
import { validatePassword } from './user';

passport.serializeUser((user, done) => done(null, (user as UserPayload).username));

passport.deserializeUser(async (req, username, done) => {
  const user = await User.findOne({ username });
  done(null, user);
});

passport.use(new Local.Strategy(async (
  username,
  password,
  done,
) => {
  try {
    const user = await User.findOne({ username });
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
