import {
  asyncHandler, authRequired, createEndpoint, withEvolution,
} from '../../../../src/lib/api/middleware';
import { deserializeEvolution, serializeRule } from '../../../../src/lib/api/serialization';

// these routes deal with the specific evolution with the given id

export default createEndpoint()
  // get this evolution
  .get(withEvolution(true), (req, res) => {
    res.json(JSON.stringify(deserializeEvolution(req.evolution)));
  })
  // modify this evolution
  .use(authRequired)
  .post(withEvolution(false), asyncHandler(async (req, res) => {
    const { from, rules, to } = req.body;
    console.log(JSON.stringify(rules, null, 4));
    if (from) req.evolution.from = from;
    if (rules) {
      console.log(JSON.stringify(rules.map(serializeRule), null, 4));
      req.evolution.rules = rules.map(serializeRule);
      req.evolution.markModified('rules');
    }
    if (to) req.evolution.to = to;
    await req.evolution.save();
    res.json(JSON.stringify(deserializeEvolution(req.evolution)));
  }));
