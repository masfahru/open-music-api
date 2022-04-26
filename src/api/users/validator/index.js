const { InvariantError } = require('open-music-exceptions');
const { UserSchema } = require('./schema');

const UserValidator = {
  /**
   * Validate user object.
   * @param {object} payload - User object
   * @returns {object} - Validated user object
   * @throws {InvariantError} - If payload is not valid
   */
  validate: (payload) => {
    const validationResult = UserSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
    return payload;
  },
};

module.exports = UserValidator;
