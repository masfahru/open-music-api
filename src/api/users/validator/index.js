const { InvariantError } = require('open-music-api-exceptions');
const { UserPayloadSchema } = require('./schema');

/**
 * User object validator.
 */
const UserValidator = {
  /**
   * @method validate
   * @param {object} payload - User object
   * @returns {object} - Validated user object
   * @throws {InvariantError} - If payload is not valid
   */
  validate: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
    return payload;
  },
};

module.exports = UserValidator;
