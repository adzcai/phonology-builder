import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { CustomRequest } from '../../../src/lib/api/apiTypes';
import { asyncHandler, onError } from '../../../src/lib/api/middleware';
import { withAuth } from '../../../src/lib/api/auth';
import { UserModel } from '../../../src/models';

export default nextConnect({ onError })
  .use(withAuth)
  .get(asyncHandler(async (req: CustomRequest, res: NextApiResponse) => {
    if (!req.session.get('user')?.username) {
      res.json({ isLoggedIn: false });
    } else {
      const { username } = req.session.get('user');
      if (await UserModel.exists({ username })) {
        res.json({ isLoggedIn: true, username });
      } else {
        res.json({ isLoggedIn: false });
      }
    }
  }));
