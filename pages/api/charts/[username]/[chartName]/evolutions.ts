import { EvolutionDocument } from '../../../../../src/lib/api/apiTypes';
import { asyncHandler, createEndpoint } from '../../../../../src/lib/api/middleware';
import { deserializeEvolution } from '../../../../../src/lib/api/serialization';
import { EvolutionModel } from '../../../../../src/models';

export default createEndpoint()
  // Gets a list of the evolutions from the chart with id `username/chartName`
  .get(asyncHandler(async (req, res) => {
    const { username, chartName } = req.query;
    const chartId = `${username}/${chartName}`;
    const evolutions = await EvolutionModel.find({ from: chartId })
      .lean().exec() as EvolutionDocument[];

    const result = JSON.stringify(evolutions.map(deserializeEvolution));

    res.json(result);
  }));
