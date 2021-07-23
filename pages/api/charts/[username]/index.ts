import { NextApiResponse } from 'next';
import { ChartModel } from '../../../../src/models';
import { asyncHandler, createEndpoint } from '../../../../src/lib/api/middleware';
import { CustomRequest } from '../../../../src/lib/api/apiTypes';
import { Phoneme } from '../../../../src/lib/client/types';
import { deserializeFeatures, serializeFeatures } from '../../../../src/lib/api/serialization';

export default createEndpoint()
  .get(asyncHandler(async (req: CustomRequest, res: NextApiResponse) => {
    const charts = await ChartModel.find({ username: req.query.username as string }).lean().exec();
    const rtn = charts.map((chart) => ({
      ...chart,
      sounds: chart.sounds.map(({ symbol, features }) => ({
        symbol, features: deserializeFeatures(features),
      })),
    }));
    res.json(JSON.stringify(rtn));
  }))
  // create new charts
  .post(asyncHandler(async (req: CustomRequest, res: NextApiResponse) => {
    const { sounds, name } = req.body as { sounds: Phoneme[]; name: string; };
    const { username } = req.session.get('user');

    const serializedSounds = sounds.map(({ symbol, features }) => ({
      symbol, features: serializeFeatures(features),
    }));

    try {
      const chart = await ChartModel.create({
        _id: `${username}/${name}`, username, name, sounds: serializedSounds, parent: null,
      });
      res.json(JSON.stringify(chart));
    } catch (err) {
      res.status(409).json({ message: err.message });
    }
  }));
