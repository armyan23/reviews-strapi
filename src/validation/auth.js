const Joi = require('joi');

module.exports = {
  signUp: function (data) {
    const schema = Joi.object({
      password: Joi.string().trim().min(2).max(40).required().messages({
        'any.required': 'Password is required.',
        'string.empty': 'Password is not allowed to be empty!',
      }),
      email: Joi.string().email().trim().min(3).max(40).required().messages({
        'any.required': 'Email is required.',
        'string.min': 'Email should have minimum length than 3 characters!',
        'string.max': 'Email should have maximum length than 40 characters!',
        'string.empty': 'Email is not allowed to be empty!',
      }),
      firstName: Joi.string().allow(null, ''),
      lastName: Joi.string().allow(null, ''),
    });

    return schema.validate(data);
  },
};
