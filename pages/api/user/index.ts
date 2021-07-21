import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import auth from '../../../src/lib/auth';
import { userToJson } from '../../../src/lib/user';
import { CustomRequest } from '../../../src/lib/types';
import { UserModel } from '../../../src/models';

function wrapAsync(fn: (req: CustomRequest, res: NextApiResponse) => Promise<any>) {
  return (req, res, next) => fn(req, res).then(next).catch((err) => console.error(err));
}

export default nextConnect()
  .use(auth)
  .get(wrapAsync(async (req: CustomRequest, res: NextApiResponse) => {
    const user = req.session.get('user');

    if (user) {
      const userData = await UserModel.findOne({ username: user.username }).exec();
      res.json(userToJson(userData));
    } else {
      res.json({ data: { isLoggedIn: false }, errorMessage: 'You must be logged in' });
    }
  }));
