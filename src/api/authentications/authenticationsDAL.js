const { AuthenticationError, InvariantError } = require('open-music-api-exceptions');
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
   * @returns {Promise<void>}
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
   * @returns {Promise<void>}
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
   * @param {{username: string, password: string}}
   *
   * Algorithms:
   * 1. Get User by username
   * If user not found, @throws {NotFoundError}
   * 2. Verify password
   * If password not match, @throws {AuthenticationError}
   *
   * @returns {Promise<id>}
   */
  async verifyUserCredential({ username, password }) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.#dbService.query(query);
    if (!result.rows.length) {
      throw new AuthenticationError('User tidak ditemukan');
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
   *
   * Algorithms:
   * 1. Delete refresh token from authentication
   * If refresh token not found, @throws {AuthenticationError}
   *
   * @returns {{Promise<void>}}
   */
  async deleteRefreshToken({ refreshToken }) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1 RETURNING token',
      values: [refreshToken],
    };

    const result = await this.#dbService.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }
};
