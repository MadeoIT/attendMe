const Joi = require('joi');

const tenantSchema = {
  googleId: Joi.string(),
  confirmed: Joi.boolean().forbidden(),
  blocked: Joi.boolean(),
  password: Joi.string().min(8),
  email: Joi.string().required(),
  tenantId: Joi.number()
};

const isTenantObjectNotValid = (body) => {
  const result = Joi.validate(body, tenantSchema);
  if(result.error) {
    return result.error.details[0].message
  }
  return false;
};

module.exports = {
  isTenantObjectNotValid
}