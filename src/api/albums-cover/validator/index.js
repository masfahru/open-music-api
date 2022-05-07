const { InvariantError } = require('open-music-api-exceptions');
const { ImageHeadersSchema } = require('./schema');

/**
 * AlbumCover object validator.
 */
const AlbumCoverValidator = {
  /**
   * @method validateHeaders
   * @param {object} payload - Request Headers object
   * @returns {object} - Validated album object
   * @throws {InvariantError} - If payload is not valid
   */
  validateHeaders: (payload) => {
    const validationResult = ImageHeadersSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
    return payload;
  },
};

module.exports = AlbumCoverValidator;
