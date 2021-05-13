import nextConnect from 'next-connect';
import passport from '../../src/lib/passport';
import auth from '../../src/lib/auth';

function authenticate(method, req, res) {
  return new Promise((resolve, reject) => {
    passport.authenticate(method, (error, token) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    })(req, res);
  });
}

export default nextConnect()
  .use(auth)
  .post(async (req, res) => {
    try {
      const user = await authenticate('local', req, res);

      req.session.set('user', { username: user.username });
      await req.session.save();
      res.json(user);
    } catch (error) {
      const { response: fetchResponse } = error;
      res.status(fetchResponse?.status || 500).json({ message: error.message });
    }
  });
