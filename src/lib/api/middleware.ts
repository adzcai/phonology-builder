import { EvolutionModel } from '../../models';

export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

export function onError(err, req, res, next) {
  console.error('internal server error (onError):', err);

  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ message: err.message });
}

export const withEvolution = (lean: boolean) => asyncHandler(async (req, res, next) => {
  const evolution = lean
    ? await EvolutionModel.findById(req.query.id).lean().exec()
    : await EvolutionModel.findById(req.query.id).exec();
  if (!evolution) {
    throw new Error(`Evolution with id ${req.query.id} not found`);
  }
  req.evolution = evolution;
  next();
});
