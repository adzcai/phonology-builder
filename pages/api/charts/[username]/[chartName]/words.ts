import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { onError } from '../../../../../src/lib/api/asyncHandler';
import { authRequired } from '../../../../../src/lib/api/auth';
import { ChartModel } from '../../../../../src/models';

export default nextConnect({ onError })
  .use(authRequired)
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    const { username, chartName } = req.query;

    if (!username || !chartName) {
      return res.status(400).json({ message: 'Provide a username and a chart name' });
    }

    const chart = await ChartModel.findById(`${req.query.username}/${req.query.chartName}`).exec();
    chart.words = req.body.words;
    chart.markModified('words');
    await chart.save();
    res.json(chart.words);
  });
