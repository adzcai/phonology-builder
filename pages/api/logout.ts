import { NextApiResponse } from 'next';
import { CustomRequest } from '../../src/lib/api/apiTypes';
import { createEndpoint } from '../../src/lib/api/middleware';

export default createEndpoint()
  .post((req: CustomRequest, res: NextApiResponse) => {
    req.session.destroy();
    res.json({ isLoggedIn: false });
  });
