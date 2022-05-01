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
   * @param {object} user
   *
   * Algorithms:
   * 1. Check if user already exists
   * If user already exists, @throws {InvariantError}
   * 2. Generate user id
   * 3. Generate timestamp
   * 4. Hash password
   * 5. Insert user to database
   * If user fails to insert, @throws {InvariantError}
   * @returns {Promise<string>}
   */
  async postUser({ username, password, fullname }) {
    const client = await this.#dbService.getClient();
    try {
      client.query('BEGIN');
      const usernameExistQuery = {
        text: 'SELECT username FROM users WHERE username = $1',
        values: [username],
      };
      const resultUsernameExists = await this.#dbService.query(usernameExistQuery);
      if (resultUsernameExists.rows[0]) {
        throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
      }
      const id = `user-${nanoid()}`;
      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = {
        text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
        values: [id, username, hashedPassword, fullname, createdAt, updatedAt],
      };
      const result = await this.#dbService.query(query);
      if (!result.rows[0].id) {
        throw new InvariantError('User gagal ditambahkan');
      }
      client.query('COMMIT');
      return result.rows[0].id;
    } catch (err) {
      client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
};
