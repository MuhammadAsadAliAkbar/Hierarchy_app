const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  let status = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Server Error';
  if (err.name === 'CastError') { status = 404; message = 'Resource not found'; }
  if (err.code === 11000) { status = 400; message = 'Duplicate value entered'; }
  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }
  res.status(status).json({ success: false, message });
};
module.exports = errorHandler;
