/**
 * Joi Schema to validate the Album object
 */
const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().min(0).max(2099).required(),
});

module.exports = { AlbumPayloadSchema };
