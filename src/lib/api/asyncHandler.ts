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
