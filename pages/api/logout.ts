import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { CustomRequest } from '../../src/assets/ipaData';
import auth from '../../src/lib/auth';

export default nextConnect()
  .use(auth)
  .post(async (req: CustomRequest, res: NextApiResponse) => {
    req.session.destroy();
    res.json({ isLoggedIn: false });
  });
