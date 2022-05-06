require('dotenv').config();
const { Pool } = require('pg');

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
    this.#pool = new Pool({
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
    });
    this.query = this.query.bind(this);
    this.getClient = this.getClient.bind(this);
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

  /**
   * @method getClient
   * @returns {Promise<Pool.Client>} - Client object
   */
  async getClient() {
    const client = await this.#pool.connect();
    const { query, release } = client;
    // set a timeout of 3 seconds, after which we will log this client's last query
    const timeout = setTimeout(() => {
      console.error('A client has been checked out for more than 3 seconds!');
      console.error(
        `The last executed query on this client was: ${client.lastQuery}`,
      );
    }, 3000);
    // monkey patch the query method to keep track of the last query executed
    client.query = (...args) => {
      client.lastQuery = args;
      return query.apply(client, args);
    };
    client.release = () => {
      // clear our timeout
      clearTimeout(timeout);
      // set the methods back to their old un-monkey-patched version
      client.query = query;
      client.release = release;
      return release.apply(client);
    };
    return client;
  }
};
