const Joi = require('joi');

module.exports = {
  userDetails: function (data) {
    const schema = Joi.object({
      firstName: Joi.string().trim().required(),
      lastName: Joi.string().trim().required(),
      googleReviews: Joi.boolean().allow(null, ''),
      companyName: Joi.string().when('googleReviews', {
        is: Joi.equal(true),
        then: Joi.string().trim().required(),
        otherwise: Joi.valid('', null).messages({
          'any.only': 'Google reviews must be switched',
        }),
      }),
      companyAddress: Joi.string().when('googleReviews', {
        is: Joi.equal(true),
        then: Joi.string().trim().required(),
        otherwise: Joi.valid('', null).messages({
          'any.only': 'Google reviews must be switched',
        }),
      }),
    });

    return schema.validate(data);
  },
};
