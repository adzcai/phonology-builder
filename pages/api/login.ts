import passport from 'passport';
import nextConnect from 'next-connect';
import localStrategy from '../../src/lib/localStrategy';
import withSession from '../../src/lib/withSession';

function authenticate(method, req, res) {
  return new Promise((resolve, reject) => {
    passport.authenticate(method, { session: false }, (error, token) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    })(req, res);
  });
}

passport.use(localStrategy);

export default nextConnect()
  .use(passport.initialize())
  .post(withSession(async (req, res) => {
    try {
      console.log(req.body);
      const user = await authenticate('local', req, res);

      req.session.set('user', user);
      await req.session.save();
      res.json(user);
    } catch (error) {
      const { response: fetchResponse } = error;
      res.status(fetchResponse?.status || 500).json({ message: error.message });
    }
  }));
