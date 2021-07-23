import { asyncHandler, authRequired, createEndpoint } from '../../../../../src/lib/api/middleware';
import { ChartModel } from '../../../../../src/models';

export default createEndpoint()
  // return this chart
  .get(asyncHandler(async (req, res) => {
    const { username, chartName } = req.query;
    const chart = await ChartModel.findById(`${username}/${chartName}`).lean().exec();
    res.json(JSON.stringify(chart));
  }))
  // delete this chart
  .use(authRequired)
  .delete(asyncHandler(async (req, res) => {
    const { chartName } = req.query;
    await ChartModel.findByIdAndDelete(`${req.user.username}/${chartName}`).lean().exec();
    res.json({ deleted: true });
  }));
