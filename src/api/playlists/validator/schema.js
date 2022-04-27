/**
 * Joi Schema to validate the Playlist object
 */
const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
}).unknown();

const PlaylistSongIdPayloadSchema = Joi.object({
  songId: Joi.string().required(),
}).unknown();

module.exports = { PlaylistPayloadSchema, PlaylistSongIdPayloadSchema };
