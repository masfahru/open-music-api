const Jwt = require('@hapi/jwt');
const { jwtConfig } = require('open-music-api-configs');
const { InvariantError } = require('open-music-api-exceptions');

/**
 * Token manager.
 */
const tokenManager = {
  /**
   * @method generateAccessToken
   * @param {{id: String}} payload - Payload to generate token.
   * @returns {String} - Generated Token
   */
  generateAccessToken: (payload) => Jwt.token.generate(payload, jwtConfig.accessTokenKey),

  /**
   * @method generateRefreshToken
   * @param {{id: String}} payload - Payload to generate token.
   * @returns {String} - Generated Token
   */
  generateRefreshToken: (payload) => Jwt.token.generate(payload, jwtConfig.refreshTokenKey),

  /**
   * @method verifyRefreshToken
   * @param {String} refreshToken - Refresh token to verify.
   * @returns {{id: String}} - Payload Object
   */
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, jwtConfig.refreshTokenKey);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};
module.exports = tokenManager;
