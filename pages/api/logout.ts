import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { CustomRequest } from '../../src/lib/api/apiTypes';
import { onError } from '../../src/lib/api/asyncHandler';
import { withAuth } from '../../src/lib/api/auth';

export default nextConnect({ onError })
  .use(withAuth)
  .post((req: CustomRequest, res: NextApiResponse) => {
    req.session.destroy();
    res.json({ isLoggedIn: false });
  });
