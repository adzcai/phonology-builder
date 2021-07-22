import nextConnect from 'next-connect';
import { asyncHandler, onError } from '../../../src/lib/api/middleware';
import { authRequired } from '../../../src/lib/api/auth';
import { EvolutionModel } from '../../../src/models';

export default nextConnect({ onError })
  .use(authRequired)
  // creates a new evolution from the passed fields
  .post(asyncHandler(async (req, res) => {
    const { from, rules, to } = req.body;
    if (!from && !rules && !to) {
      return res.status(400).json({ message: 'You must pass at least one of the fields "from", "rules", or "to"!'})
    }
    const evolution = await EvolutionModel.create({ from, rules, to });
    await evolution.save();
    res.json(evolution);
  }));
