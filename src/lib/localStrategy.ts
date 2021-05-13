import Local from 'passport-local';
import { validatePassword } from './user';
import User from '../models/User';
import dbConnect from '../assets/dbconnect';

export default new Local.Strategy(async (
  username,
  password,
  done,
) => {
  try {
    await dbConnect();

    const user = await User.findOne({ username });
    if (user && validatePassword(user, password)) {
      done(null, user);
    } else {
      done(new Error('Invalid username and password combination'));
    }
  } catch (error) {
    done(error);
  }
});
