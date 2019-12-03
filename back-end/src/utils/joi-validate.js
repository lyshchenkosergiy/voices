const Joi = require('joi');

module.exports = (schema) => async (req, res, next) => {
  try {
    await Joi.validate(req.body, schema);
    next();
  } catch (error) {
    next(error);
  }
};
