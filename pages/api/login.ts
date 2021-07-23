import { NextApiResponse } from 'next';
import passport from '../../src/lib/api/passport';
import { CustomRequest } from '../../src/lib/api/apiTypes';
import { createEndpoint } from '../../src/lib/api/middleware';

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

export default createEndpoint()
  .post(async (req: CustomRequest, res: NextApiResponse) => {
    try {
      // hacky typescript workaround, user is the second argument to `done` in /src/lib/passport.ts
      const { username } = await authenticate('local', req, res) as { username: string };
      req.session.set('user', { username });
      await req.session.save();
      res.json({ isLoggedIn: true, username });
    } catch (error) {
      const { response: fetchResponse } = error;
      res.status(fetchResponse?.status || 500).json({ message: error.message });
    }
  });
