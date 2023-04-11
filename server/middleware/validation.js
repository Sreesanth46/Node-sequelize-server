const joi = require("joi");

function registerValidation(data) {
  const schema = joi.object({
    name: joi.string().min(4).required(),
    code: joi.string().required(),
    phone: joi.string().min(10).required(),
    firstName: joi.string().min(4).required(),
    lastName: joi.string().min(4).required(),
    accountId: joi.string().min(4).email().required(),
    password: joi.string().min(7).required(),
  });
  return schema.validate(data);
}

function loginValidation(data) {
  const schema = joi.object({
    email: joi.string().min(4).email().required(),
    password: joi.string().min(8).required(),
  });
  return schema.validate(data);
}

module.exports = { registerValidation, loginValidation };
