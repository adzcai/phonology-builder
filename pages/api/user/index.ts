import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { CustomRequest } from '../../../src/assets/ipa-data';
import auth from '../../../src/lib/auth';
import { userToJson } from '../../../src/lib/user';
import User from '../../../src/models/User';

export default nextConnect()
  .use(auth)
  .get(async (req: CustomRequest, res: NextApiResponse) => {
    const user = req.session.get('user');

    if (user) {
      const userData = await User.findOne({ username: user.username }).populate({
        path: 'charts',
        populate: {
          path: 'sounds',
          model: 'Sound',
        },
      }).exec();

      res.json(userToJson(userData));
    } else {
      res.json({ data: { isLoggedIn: false }, errorMessage: 'You must be logged in' });
    }
  });
