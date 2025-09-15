// middlewares/validate.js
const { z, ZodError } = require('zod');

// Consistent error responder
const sendError = (res, code, message, details) =>
  res.status(code).json({
    success: false,
    message,
    data: null,
    error: { code, details },
  });

// Pick the first error message only
const firstErrorMessage = (issues) => issues[0]?.message || 'Invalid input';

const validate =
  (schema, target = 'body') =>
  (req, res, next) => {
    try {
      const data =
        target === 'query'
          ? req.query
          : target === 'params'
          ? req.params
          : req.body;

      const result = schema.safeParse(data);
      if (!result.success) {
        return sendError(
          res,
          400,
          'Validation failed',
          firstErrorMessage(result.error.issues),
        );
      }

      if (target === 'query') req.query = result.data;
      else if (target === 'params') req.params = result.data;
      else req.body = result.data;

      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        return sendError(
          res,
          400,
          'Validation failed',
          firstErrorMessage(err.issues),
        );
      }
      return sendError(res, 500, 'Server error', err.message);
    }
  };

module.exports = { validate };
