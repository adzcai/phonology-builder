import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import auth, { authRequired } from '../../../../../src/lib/auth';
import { ChartModel } from '../../../../../src/models';

export default nextConnect()
  .use(auth)
  .use(authRequired)
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    await ChartModel.updateOne({ _id: `${req.query.username}/${req.query.chartName}` }, {
      words: req.body.words,
    }).exec();
    res.json({ data: { message: 'received' } });
  });
