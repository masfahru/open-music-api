const { nanoid } = require('nanoid');
const { InvariantError, NotFoundError } = require('open-music-api-exceptions');
const { albumDbToModel } = require('./albumsMapper');

/**
 * Class of Database access layer (DAL) for the albums.
 * @class
 */
module.exports = class AlbumsDAL {
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
   * Get all albums.
   * @async
   * @returns {Promise<object[]>} - List of albums
   * @throws {NotFoundError}
   */
  async getAllAlbums() {
    const query = {
      text: 'SELECT id, name, year, cover_url FROM albums',
    };

    const result = await this.#dbService.query(query);
    if (!result.rows[0]) {
      throw new NotFoundError('Belum ada album yang ditambahkan');
    }

    return result.rows.map(albumDbToModel);
  }

  /**
   * Get album by id.
   * @async
   * @param {{albumId: string}}
   * @returns {Promise<object>} - Album object
   * @throws {NotFoundError}
   */
  async getAlbumById({ albumId }) {
    const query = {
      text: 'SELECT id, name, year, cover_url FROM albums WHERE id = $1',
      values: [albumId],
    };

    const result = await this.#dbService.query(query);
    if (!result.rows[0]) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return albumDbToModel(result.rows[0]);
  }

  /**
   * Get all songs by album id.
   * @async
   * @param {{albumId: string}}
   * @returns {Promise<object[]>}
   */
  async getSongByAlbumId({ albumId }) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this.#dbService.query(query);
    if (!result.rows[0]) {
      return null;
    }

    return result.rows;
  }

  /**
   * Create a new album.
   * @async
   * @param {{name:string, year: number}}
   * @returns {Promise<object>}
   * @throws {InvariantError}
   */
  async postAlbum({ name, year }) {
    const id = `album-${nanoid()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [
        id,
        name,
        year,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this.#dbService.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  /**
   * Update album by id.
   * @async
   * @param {{id:string, name:string, year:number}}
   * @returns {Promise<void>}
   * @throws {NotFoundError}
   */
  async putAlbumById({ id, name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };
    const result = await this.#dbService.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  /**
   * Delete album by id.
   * @async
   * @param {{albumId: string}}
   * @returns {Promise<void>}
   * @throws {NotFoundError}
   */
  async deleteAlbumById({ albumId }) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [albumId],
    };
    const result = await this.#dbService.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus album. Id tidak ditemukan');
    }
  }
};
