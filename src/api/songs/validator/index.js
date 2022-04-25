const { InvariantError } = require('open-music-exceptions');
const { SongSchema } = require('./schema');

const SongValidator = {
  /**
   * Validate song object.
   * @param {object} payload - Song object
   * @returns {object} - Validated song object
   * @throws {InvariantError} - If payload is not valid
   */
  validate: (payload) => {
    const validationResult = SongSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
    return payload;
  },
};

module.exports = SongValidator;
