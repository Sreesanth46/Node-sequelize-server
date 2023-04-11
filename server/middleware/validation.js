const joi = require("joi");

function registerValidation(data) {
  const schema = joi.object({
    name: joi.string().min(4).required().max(50).messages({
      'string.min' : '1001',
      'string.empty' : '1001',
      'string.max' : '1001',
      'any.required' : '1010'
    }),

    code: joi.string().min(1).required().max(20).messages({
      'string.min' : '1002',
      'string.empty' : '1002',
      'string.max' : '1002',
      'any.required' : '1011'
    }),

    nickName: joi.string().required().min(4).messages({
      'string.min' : '3001',
      'string.empty' : '3001',
      'string.max' : '3001',
      'any.required' : '1017'
    }),

    phone: joi.string().min(10).required().max(13).messages({
      'string.min' : '1003',
      'string.empty' : '1003',
      'string.max' : '1003',
      'any.required' : '1003'
    }),

    firstName: joi.string().min(4).required().max(10).messages({
      'string.min' : '1006',
      'string.empty' : '1006',
      'string.max' : '1006',
      'any.required' : '1014'
    }),

    lastName: joi.string().min(4).required().max(10).messages({
      'string.min' : '1004',
      'string.empty' : '1004',
      'string.max' : '1004',
      'any.required' : '1013'
    }),

    accountId: joi.string().min(4).required().max(50).messages({
      'string.min' : '1007',
      'string.empty' : '1007',
      'string.max' : '1007',
      'any.required' : '1015'
    }),

    email: joi.string().min(4).email().messages({
      'string.min' : '2001',
      'string.empty' : '2001',
      'string.max' : '2001',
      'any.required' : '1009'
    }),
    
    password: joi.string().min(7).required().max(50).messages({
      'string.min' : '1008',
      'string.empty' : '1008',
      'string.max' : '1008',
      'any.required' : '1016'
    }),
  });
  return schema.validate(data);
}

function loginValidation(data) {
  const schema = joi.object({
    email: joi.string().min(3).required().messages({
      'string.min' : '2001',
      'string.empty' : '2001',
      'string.max' : '2001',
      'any.required' : '1009'
    }),

    password: joi.string().min(8).required().messages({
      'string.min' : '1008',
      'string.empty' : '1008',
      'string.max' : '1008',
      'any.required' : '1016'
    }),
  });
  return schema.validate(data);
}

module.exports = { registerValidation, loginValidation };
