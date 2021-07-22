import nextConnect from 'next-connect';
import { NextApiResponse } from 'next';
import passport from '../../src/lib/api/passport';
import { CustomRequest } from '../../src/lib/api/apiTypes';
import { withAuth } from '../../src/lib/api/auth';
import { onError } from '../../src/lib/api/asyncHandler';

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

export default nextConnect({ onError })
  .use(withAuth)
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
