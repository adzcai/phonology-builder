import nextConnect from 'next-connect';
import { asyncHandler, onError } from '../../../../../src/lib/api/asyncHandler';
import { authRequired } from '../../../../../src/lib/api/auth';
import { ChartModel } from '../../../../../src/models';

export default nextConnect({ onError })
  .use(authRequired)
  .delete(asyncHandler(async (req, res) => {
    const { chartName } = req.query;
    await ChartModel.findByIdAndDelete(`${req.user.username}/${chartName}`).lean().exec();
    res.json({ deleted: true });
  }));
