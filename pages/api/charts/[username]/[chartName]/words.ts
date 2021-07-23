import { NextApiRequest, NextApiResponse } from 'next';
import { asyncHandler, authRequired, createEndpoint } from '../../../../../src/lib/api/middleware';
import { ChartModel } from '../../../../../src/models';

export default createEndpoint()
  .get(asyncHandler(async (req, res) => {
    const { username, chartName } = req.query;
    const chart = await ChartModel.findById(`${username}/${chartName}`).lean().exec();
    if (!chart) {
      res.status(404).json({ message: 'not found' });
    } else {
      res.json(JSON.stringify(chart.words));
    }
  }))
  .use(authRequired)
  .post(asyncHandler(async (req: NextApiRequest, res: NextApiResponse) => {
    const { username, chartName } = req.query;

    if (!username || !chartName) {
      return res.status(400).json({ message: 'Provide a username and a chart name' });
    }

    const chart = await ChartModel.findById(`${username}/${chartName}`).exec();
    chart.words = req.body.words;
    chart.markModified('words');
    await chart.save();
    res.json(chart.words);
  }));
