const Joi = require('joi');

//TODO: add other properties
const tenantSchema = {
  confirmed: Joi.boolean().forbidden(),
  password: Joi.string(),
  email: Joi.string(),
  tenantId: Joi.number()
};

const validateTenant = (body, res) => {
  const result = Joi.validate(body, tenantSchema);
  if(result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  return;
};

module.exports = {
  validateTenant
}