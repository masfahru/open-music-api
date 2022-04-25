const { Pool } = require('pg');
const { dbConfig } = require('../../configs');

module.exports = class DBServices {
  #pool;

  constructor() {
    this.#pool = new Pool(dbConfig);
  }

  async query({ text, values }) {
    const start = Date.now();
    const res = await this.#pool.query(text, values);
    const duration = Date.now() - start;
    console.log('PostgreQuery:', { text, duration, rows: res.rowCount });
    return res;
  }
};
