import nextConnect from 'next-connect';
import { asyncHandler, onError } from '../../../../../src/lib/api/middleware';
import { EvolutionModel } from '../../../../../src/models';

export default nextConnect({ onError })
  // Gets a list of the evolutions from the chart with id `username/chartName`
  .get(asyncHandler(async (req, res) => {
    const { username, chartName } = req.query;
    const chartId = `${username}/${chartName}`;
    const evolutions = await EvolutionModel.find({ from: chartId }).lean().exec();
    res.json(JSON.stringify(evolutions));
  }));
