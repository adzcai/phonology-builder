import nextConnect from 'next-connect';
import { NextApiResponse } from 'next';
import passport from '../../src/lib/passport';
import auth from '../../src/lib/auth';
import { CustomRequest } from '../../src/assets/ipa-data';
import { userToJson } from '../../src/lib/user';

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
  .post(async (req: CustomRequest, res: NextApiResponse) => {
    try {
      // hacky typescript workaround, user is the second argument to `done` in /src/lib/passport.ts
      const user = await authenticate('local', req, res) as { username: string };

      req.session.set('user', { username: user.username });
      await req.session.save();
      res.json(userToJson(user));
    } catch (error) {
      const { response: fetchResponse } = error;
      res.status(fetchResponse?.status || 500).json({ errorMessage: error.message });
    }
  });
