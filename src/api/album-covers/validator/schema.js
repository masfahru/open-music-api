const Joi = require('joi');

const ImageHeadersSchema = Joi.object({
  cover: Joi.object({
    hapi: Joi.object({
      headers: Joi.object({
        'content-type': Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp').required(),
      }).required().unknown(),
    }).required().unknown(),
  }).required().unknown(),
}).unknown();

module.exports = { ImageHeadersSchema };
