const { error } = require('../utils/response');

const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err.name === 'ZodError') {
        const details = err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }));
        return res.status(400).json(error('VALIDATION_ERROR', 'Validation failed', details));
      }
      next(err);
    }
  };
};

module.exports = validate;
