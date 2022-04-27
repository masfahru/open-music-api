const { InvariantError } = require('open-music-api-exceptions');
const { AlbumPayloadSchema } = require('./schema');

/**
 * Album object validator.
 */
const AlbumValidator = {
  /**
   * @method validate
   * @param {object} payload - Album object
   * @returns {object} - Validated album object
   * @throws {InvariantError} - If payload is not valid
   */
  validate: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
    return payload;
  },
};

module.exports = AlbumValidator;
