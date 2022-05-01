/**
 * Class to handle requests related to authentications.
 */
module.exports = class AuthenticationsHandler {
  /**
   * Authentication Data Access Layer.
   * @type {AuthenticationsDAL}
   * @private
   */
  #authDAL;

  /**
   * Authentication Validator.
   * @type {AuthenticationValidator}
   * @private
   */
  #validator;

  /**
   * Token Manager
   * @type {TokenManager}
   * @private
   */
  #tokenManager;

  /**
   * @constructor
   * @param {AuthenticationsDAL} authenticationsDAL - Authentications Data Access Layer
   * @param {AuthenticationValidator} authenticationValidator
   * @param {TokenManager} tokenManager
   */
  constructor(authenticationsDAL, authenticationValidator, tokenManager) {
    this.#authDAL = authenticationsDAL;
    this.#validator = authenticationValidator;
    this.#tokenManager = tokenManager;
    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  /**
   * Create a new authentication.
   * @async
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   *
   * Algorithms:
   * 1. Validate request payload
   * 2. Validate user credential (username and password)
   * 3. Generate access token
   * 4. Generate refresh token
   * 5. Save refresh token to database
   * 6. Put refresh token and access token to response
   *
   * @return {Promise<response>} Hapi response object
   */
  async postAuthenticationHandler(request, h) {
    const { username, password } = this.#validator.validatePostAuthPayload(
      request.payload,
    );
    const id = await this.#authDAL.verifyUserCredential({ username, password });
    const accessToken = this.#tokenManager.generateAccessToken({ id });
    const refreshToken = this.#tokenManager.generateRefreshToken({ id });
    await this.#authDAL.postRefreshToken({ refreshToken });
    return h
      .response({
        status: 'success',
        message: 'Authentication berhasil ditambahkan',
        data: {
          accessToken,
          refreshToken,
        },
      })
      .code(201);
  }

  /**
   * Refresh Access Token.
   * @async
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   *
   * Algorithms:
   * 1. Validate request payload and get refresh token
   * 2. Verify refresh token
   * 3. Generate new access token
   * 4. Put new access token to response
   *
   * @return {Promise<response>} Hapi response object
   */
  async putAuthenticationHandler(request, h) {
    const { refreshToken } = this.#validator.validatePutAuthPayload(
      request.payload,
    );
    await this.#authDAL.verifyRefreshToken({ refreshToken });
    const { id } = this.#tokenManager.verifyRefreshToken({ refreshToken });
    const accessToken = this.#tokenManager.generateAccessToken({ id });
    return h
      .response({
        status: 'success',
        message: 'Access Token berhasil diperbarui',
        data: {
          accessToken,
        },
      })
      .code(200);
  }

  /**
   * Delete Refresh Token.
   * @async
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   *
   * Algorithms:
   * 1. Validate request payload and get refresh token
   * 2. Verify refresh token
   * 3. Delete refresh token from database
   * @return {Promise<response>} Hapi response object
   */
  async deleteAuthenticationHandler(request, h) {
    const { refreshToken } = this.#validator.validateDeleteAuthPayload(request.payload);
    await this.#authDAL.verifyRefreshToken({ refreshToken });
    await this.#authDAL.deleteRefreshToken({ refreshToken });
    return h
      .response({
        status: 'success',
        message: 'Refresh token berhasil dihapus',
      })
      .code(200);
  }
};
