const { Pool } = require('pg');
const { dbConfig } = require('open-music-api-configs');

/**
 * Database service.
 * @class DbService
 */
module.exports = class DbService {
  /**
   * Postgres connection pool.
   * @private
   */
  #pool;

  constructor() {
    this.#pool = new Pool(dbConfig);
  }

  /**
   * @method query
   * @param {object} query - Query object
   * @returns {Promise<object>} - Query result
   */
  async query({ text, values }) {
    const start = Date.now();
    const res = await this.#pool.query(text, values);
    const duration = Date.now() - start;
    console.log('PostgreQuery:', { text, duration, rows: res.rowCount });
    return res;
  }
};
