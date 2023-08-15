import Joi from './joi';

/*
use
https: //www.npmjs.com/package/hapi-swagger
https: //github.com/glennjones/be-more-hapi/blob/master/lib/routes.js
https: //github.com/glennjones/hapi-swagger/blob/HEAD/usageguide.md
https: //github.com/glennjones/hapi-swagger/blob/HEAD/optionsreference.md
*/

const internals = {
  mongoId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Must be a valid mongo id.')
    .description('Mongo id, 24 hexadecimal characters')
    .trim()
    .example('5bf9a1aeeb685eb8ae4d4d8e'),

  email: Joi.string().min(5).max(60).trim().email({ minDomainSegments: 2 }).required(),
  emailNotRequired: Joi.string().min(5).max(60).trim().email({ minDomainSegments: 2 }),

  dial_code: Joi.string().required().default(966),
  country_code: Joi.string().default('SA'),

  phone: Joi.string().required(),

  username: Joi.string().min(6).max(40).trim().required(),
  password: Joi.string().min(4).max(40).trim().required(),

  firstName: Joi.string().min(2).max(40).trim(),
  lastName: Joi.string().min(2).max(40).trim(),
  address: Joi.string().min(2).max(100).trim(),

  file: Joi.any()
    .meta({ swaggerType: 'file' })
    .description('File Data'),

  stringOptional: Joi.string().min(2).max(50).trim(),
  stringRequired: Joi.string().required().min(2).max(50).trim(),

  booleanRequired: Joi.boolean().required(),
  booleanOptional: Joi.boolean(),

  numberRequired: Joi.number().required(),
  numberOptional: Joi.number(),

  startDate: Joi.date(),
  endDate: Joi.date(),
};

export default internals;