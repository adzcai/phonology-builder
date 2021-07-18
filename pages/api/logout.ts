import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import auth from '../../src/lib/auth';
import { CustomRequest } from '../../src/lib/types';

export default nextConnect()
  .use(auth)
  .post(async (req: CustomRequest, res: NextApiResponse) => {
    req.session.destroy();
    res.json({ data: { isLoggedIn: false } });
  });
