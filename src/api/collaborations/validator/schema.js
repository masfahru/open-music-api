/**
 * Joi Schema to validate the Collaborations object
 */
const Joi = require('joi');

const CollaborationsPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
}).unknown();

module.exports = { CollaborationsPayloadSchema };
