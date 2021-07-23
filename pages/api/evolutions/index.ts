import { asyncHandler, authRequired, createEndpoint } from '../../../src/lib/api/middleware';
import { deserializeEvolution } from '../../../src/lib/api/serialization';
import { EvolutionModel } from '../../../src/models';

export default createEndpoint()
  .use(authRequired)
  // creates a new evolution from the passed fields
  .post(asyncHandler(async (req, res) => {
    const { from, rules, to } = req.body;
    if (!from && !rules && !to) {
      return res.status(400).json({ message: 'You must pass at least one of the fields "from", "rules", or "to"!' });
    }
    const evolution = await EvolutionModel.create({ from, rules, to });
    await evolution.save();
    res.json(deserializeEvolution(evolution));
  }));
