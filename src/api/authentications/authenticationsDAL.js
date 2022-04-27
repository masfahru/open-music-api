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
   * @param {{refreshToken: string}}
   * @returns {void}
   */
  async postRefreshToken({ refreshToken }) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [refreshToken],
    };

    await this.#dbService.query(query);
  }

  /**
   * Verify the refresh token.
   * @async
   * @param {{refreshToken: string}}
   * @returns {void}
   * @throws {InvariantError}
   */
  async verifyRefreshToken({ refreshToken }) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [refreshToken],
    };

    const result = await this.#dbService.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  /**
   * Verify Username and Password
   * @async
   * @param {{username: string, password: string}} - User Creditentials
   * @returns {Promise<id>} - User id
   * @throws {AuthenticationError} - if user not found or password incorrect
   */
  async verifyUserCredential({ username, password }) {
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
   * @param {{refreshToken: string}}
   * @returns {void}
   */
  async deleteRefreshToken({ refreshToken }) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [refreshToken],
    };

    await this.#dbService.query(query);
  }
};
