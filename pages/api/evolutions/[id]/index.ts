import nextConnect from 'next-connect';
import { authRequired } from '../../../../src/lib/api/auth';
import { asyncHandler, onError, withEvolution } from '../../../../src/lib/api/middleware';

// these routes deal with the specific evolution with the given id

export default nextConnect({ onError })
  // get this evolution
  .get(withEvolution(true), (req, res) => {
    res.json(JSON.stringify(req.evolution));
  })
  // modify this evolution
  .post(authRequired, withEvolution(false), asyncHandler(async (req, res) => {
    const { from, rules, to } = req.body;
    if (from) req.evolution.from = from;
    if (rules) {
      req.evolution.rules = rules;
      req.evolution.markModified('rules');
    }
    if (to) req.evolution.to = to;
    await req.evolution.save();
    res.json(JSON.stringify(req.evolution));
  }));
