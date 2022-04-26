/**
 * Joi Schema to validate the User object
 */
const Joi = require('joi');

const UserSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
});

module.exports = { UserSchema };
