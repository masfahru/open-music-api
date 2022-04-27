const { InvariantError } = require('open-music-api-exceptions');
const {
  PostAuthPayloadSchema,
  PutAuthPayloadSchema,
  DeleteAuthPayloadSchema,
} = require('./schema');

/**
 * Authentication object validator.
 */
const authenticationPayloadValidator = {
  /**
   * @method validatePostAuthPayload
   * @param {{username: string, password: string}} payload - User Credentials
   * @returns {object}
   */
  validatePostAuthPayload: (payload) => {
    const validationResult = PostAuthPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
    return payload;
  },
  /**
   * @method validatePutAuthPayload
   * @param {{refreshToken: string}} payload - refresh Token
   * @returns {object}
   */
  validatePutAuthPayload: (payload) => {
    const validationResult = PutAuthPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
    return payload;
  },
  /**
   * @method validateDeleteAuthPayload
   * @param {{refreshToken: string}} payload - refresh Token
   * @returns {object}
   */
  validateDeleteAuthPayload: (payload) => {
    const validationResult = DeleteAuthPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
    return payload;
  },
};
module.exports = authenticationPayloadValidator;
