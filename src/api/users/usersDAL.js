const { nanoid } = require('nanoid');
const { InvariantError } = require('open-music-api-exceptions');
const bcrypt = require('bcrypt');

/**
 * Database access layer (DAL) for the users.
 * @class
 */
module.exports = class UsersDAL {
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
   * Create a new user.
   * @async
   * @param {object} user - User object (without id)
   * @returns {Promise<object>} - User object
   * @throws {InvariantError} - Invalid user or user already exists or database error
   */
  async postUser({ username, password, fullname }) {
    await this.verifyNewUsername(username);
    const id = `user-${nanoid()}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };
    const result = await this.#dbService.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('User gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  /**
   * Verify New Username
   * @async
   * @param {string} username - User name
   * @returns {void}
   * @throws {InvariantError} - if user already exists
   */
  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this.#dbService.query(query);
    if (result.rows[0]) {
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
    }
  }
};
