const { InvariantError, AuthenticationError } = require('open-music-api-exceptions');
const bcrypt = require('bcrypt');

/**
 * Database access layer (DAL) for the authentications.
 * @class
 */
module.exports = class AuthenticationsDAL {
  /**
   * Database Services
   * @private
   */
  #dbService;

  /**
   * @constructor
   * @param {DbService} dbService - Database Service
   */
  constructor(dbService) {
    this.#dbService = dbService;
  }

  /**
   * Create a new authentication refresh token.
   * @async
   * @param {string} token - Refresh token
   * @returns {void}
   */
  async postRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await this.#dbService.query(query);
  }

  /**
   * Verify the refresh token.
   * @async
   * @param {string} token - Refresh token
   * @returns {void}
   * @throws {InvariantError}
   */
  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this.#dbService.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  /**
   * Verify Username and Password
   * @async
   * @param {string} username - User name
   * @param {string} password - User password
   * @returns {Promise<id>} - User id
   * @throws {AuthenticationError} - if user not found or password incorrect
   */
  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.#dbService.query(query);
    if (!result.rows.length) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const { id, password: hashedPassword } = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }
    return id;
  }

  /**
   * Delete refresh token from authentication.
   * @async
   * @param {string} token - Refresh token
   * @returns {void}
   */
  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this.#dbService.query(query);
  }
};
