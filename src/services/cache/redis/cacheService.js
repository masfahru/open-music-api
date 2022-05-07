const redis = require('redis');
const { redisConfig } = require('open-music-api-configs');

module.exports = class CacheService {
  /**
   * Redis client
   * @private
   */
  #client;

  /**
   * @constructor
   */
  constructor() {
    this.#client = redis.createClient({
      socket: {
        host: redisConfig.host,
      },
    });
    this.#client.on('error', (error) => {
      console.error(error);
    });
    this.#client.connect();
  }

  /**
   * Set value in cache
   * @async
   * @param {string} key
   * @param {string} value
   * @param {number} expirationInSecond
   */
  async set(key, value, expirationInSecond = 1800) {
    await this.#client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  /**
   * Get value from cache
   * @async
   * @param {string} key
   */
  async get(key) {
    const result = await this.#client.get(key);
    if (result === null) throw new Error('Cache tidak ditemukan');
    return result;
  }

  /**
   * Delete value from cache
   * @async
   * @param {string} key
   * @returns {boolean}
   */
  async delete(key) {
    return this.#client.del(key);
  }
};
