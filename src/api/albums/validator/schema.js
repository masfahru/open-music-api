/**
 * Joi Schema to validate the Album object
 */
const Joi = require('joi');

const SongSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().max(2099).required(),
  songs: [
    Joi.allow(null),
    Joi.array().items(
      Joi.object({
        id: [Joi.allow(null), Joi.string()], // id of the song
        title: Joi.string().required(),
        performer: Joi.string().required(),
      }),
    ),
  ],
});

module.exports = { SongSchema };
