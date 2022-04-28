const { InvariantError } = require('open-music-api-exceptions');
const { CollaborationsPayloadSchema } = require('./schema');

/**
 * Collaborations object validator.
 */
const CollaborationsValidator = {
  /**
   * @method validate
   * @param {object} payload - Collaborations object
   * @returns {object} - Validated album object
   * @throws {InvariantError} - If payload is not valid
   */
  validate: (payload) => {
    const validationResult = CollaborationsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
    return payload;
  },
};

module.exports = CollaborationsValidator;
