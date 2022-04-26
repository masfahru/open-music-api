/**
 * Joi Schema to validate the Song object
 */
const Joi = require('joi');

const SongSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().max(2099).required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: [Joi.allow(null), Joi.number()],
  albumId: [Joi.allow(null), Joi.string()],
});

module.exports = { SongSchema };
