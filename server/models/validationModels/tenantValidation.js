const Joi = require('joi');

const tenantSchema = {
  googleId: Joi.string(),
  confirmed: Joi.boolean().forbidden(),
  blocked: Joi.boolean(),
  password: Joi.string().min(8),
  email: Joi.string().required(),
  tenantId: Joi.number()
};


module.exports = {
  tenantSchema
}