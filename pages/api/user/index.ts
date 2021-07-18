import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { CustomRequest } from '../../../src/assets/ipa-data';
import auth from '../../../src/lib/auth';
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

      const data = {
        isLoggedIn: true,
        username: userData.username,
        charts: userData.charts
          .map(({ name, sounds }) => ({
            name,
            sounds: sounds
              .map((s) => Object.keys(s.toJSON())
                .reduce((prev, curr) => ({ ...prev, [curr]: ['true', 'false', '0'].includes(s[curr]) ? JSON.parse(s[curr]) : s[curr] }), {})),
          })),
      };
      res.json({ data });
    } else {
      res.json({ data: { isLoggedIn: false }, errorMessage: 'You must be logged in' });
    }
  });
