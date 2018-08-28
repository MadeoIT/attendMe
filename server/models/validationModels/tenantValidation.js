const Joi = require('joi');

const tenantSchema = {
  googleId: Joi.string().forbidden(),
  email: Joi.string().required(),
  password: Joi.string().min(8),

  confirmed: Joi.boolean().forbidden(),
  fullName: Joi.string(),
  alias: Joi.string(),
  blocked: Joi.boolean(),
  tenantId: Joi.number()
};

const tenantGoogleSchema = {
  googleId: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().forbidden(),
  
  confirmed: Joi.boolean().forbidden(),
  fullName: Joi.string(),
  alias: Joi.string(),
  blocked: Joi.boolean(),
  tenantId: Joi.number()
}

module.exports = {
  tenantSchema,
  tenantGoogleSchema
}