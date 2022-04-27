const { InvariantError } = require('open-music-api-exceptions');
const { SongPayloadSchema } = require('./schema');

/**
 * Song object validator.
 */
const SongValidator = {
  /**
   * @method validate
   * @param {object} payload - Song object
   * @returns {object} - Validated song object
   * @throws {InvariantError} - If payload is not valid
   */
  validate: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
    return payload;
  },
};

module.exports = SongValidator;
