import Joi from 'joi';

// using a custom version of Joi is necessary to support
// Object string coercion, which happens in multipart requests
// where we upload photos and send stringified JSON data along with the request
// for more information look here: https://github.com/hapijs/joi/issues/2388
// this file should be the only file in the project that includes `joi`
// any other file should just use this version of Joi

/**
 * @type {Joi}
 */
const customJoi = Joi
  .defaults(setAbortEarlyToFalse)
  .extend(notTrimmedString)
  .extend(trimStrings)

function setAbortEarlyToFalse(joi) {
  return joi.options({ abortEarly: false });
}

function notTrimmedString(joi) {
  return {
    base: joi.string(),
    type: 'notTrimmedString'
  };
}

function trimStrings(joi) {
  return {
    base: joi.string().trim(),
    type: 'string'
  };
}

export default customJoi;