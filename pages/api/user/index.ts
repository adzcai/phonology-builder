import { NextApiResponse } from 'next';
import { CustomRequest } from '../../../src/lib/api/apiTypes';
import { asyncHandler, createEndpoint } from '../../../src/lib/api/middleware';
import { UserModel } from '../../../src/models';

export default createEndpoint()
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
