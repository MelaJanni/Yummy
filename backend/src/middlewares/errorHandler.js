const { error } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'SequelizeValidationError') {
    const details = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json(error('VALIDATION_ERROR', 'Validation failed', details));
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0]?.path || 'field';
    return res.status(409).json(error('DUPLICATE_ERROR', `${field} already exists`));
  }

  if (err.name === 'ZodError') {
    const details = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));
    return res.status(400).json(error('VALIDATION_ERROR', 'Validation failed', details));
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json(error(err.code || 'ERROR', err.message));
  }

  res.status(500).json(error('INTERNAL_ERROR', 'Internal server error'));
};

module.exports = errorHandler;
