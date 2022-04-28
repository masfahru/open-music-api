const { nanoid } = require('nanoid');
const {
  InvariantError,
  NotFoundError,
  AuthorizationError,
} = require('open-music-api-exceptions');

/**
 * Class of Database access layer (DAL) for the playlists.
 * @class
 */
module.exports = class PlaylistsDAL {
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
   * Create a new playlist.
   * @async
   * @param {{name: string, owner: string}}
   * @returns {Promise<object>} - Playlist object
   * @throws {InvariantError} - Invalid playlist or playlist already exists or database error
   */
  async postPlaylist({ name, owner }) {
    const id = `playlist-${nanoid()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, owner, createdAt, updatedAt],
    };

    const result = await this.#dbService.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  /**
   * Get all playlists.
   * @async
   * @param {{userId: string}}
   * @returns {Promise<object[]>} - List of playlists
   * @throws {NotFoundError}
   */
  async getAllPlaylists({ userId }) {
    const query = {
      text: `SELECT playlists.id, name, username
      FROM playlists 
      LEFT JOIN users ON playlists.owner = users.id
      LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id
      WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
      values: [userId],
    };

    const result = await this.#dbService.query(query);

    return result.rows;
  }

  /**
   * Delete playlist by id.
   * @async
   * @param {{playlistId: string}} - Playlist Id
   * @returns {Promise<void>}
   * @throws {NotFoundError}
   */
  async deletePlaylistById({ playlistId }) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [playlistId],
    };
    const result = await this.#dbService.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus playlist. Id tidak ditemukan');
    }
  }

  /**
   * Verify playlist owner
   * @async
   * @param {{playlistId: string, owner:string}}
   * @returns {Promise<void>}
   * @throws {AuthorizationError}
   */
  async verifyPlaylistOwner({ playlistId, owner }) {
    const queryOwner = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const result = await this.#dbService.query(queryOwner);
    if (result.rows[0] && result.rows[0].owner !== owner) {
      throw new AuthorizationError(
        'Anda tidak memiliki hak akses pada playlist ini',
      );
    }
  }

  /**
   * Verify playlist collaboration
   * @async
   * @param {{playlistId: string, userId: string}}
   * @returns {Promise<void>}
   * @throws {AuthorizationError}
   */
  async verifyPlaylistCollaboration({ playlistId, userId }) {
    const client = await this.#dbService.getClient();
    try {
      await client.query('BEGIN');

      const queryOwner = {
        text: 'SELECT owner FROM playlists WHERE id = $1',
        values: [playlistId],
      };
      const result = await this.#dbService.query(queryOwner);
      if (result.rows[0] && result.rows[0].owner !== userId) {
        const queryCollaborator = {
          text: 'SELECT user_id FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
          values: [playlistId, userId],
        };
        const collaborator = await this.#dbService.query(queryCollaborator);
        if (!collaborator.rows[0]) {
          throw new AuthorizationError('Anda tidak memiliki hak akses pada playlist ini');
        }
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Post Song to playlist by id
   * @async
   * @param {{playlistId: string, songId: string}} - Playlist Id and Song Id
   * @returns {Promise<void>}
   * @throws {NotFoundError}
   */
  async postSongToPlaylistById({ playlistId, songId }) {
    const client = await this.#dbService.getClient();
    try {
      await client.query('BEGIN');
      const queryPlaylist = {
        text: 'SELECT id FROM playlists WHERE id = $1',
        values: [playlistId],
      };
      const playlist = await this.#dbService.query(queryPlaylist);
      if (!playlist.rows[0]) {
        throw new NotFoundError('Playlist tidak ditemukan');
      }
      const querySong = {
        text: 'SELECT id FROM songs WHERE id = $1',
        values: [songId],
      };
      const song = await client.query(querySong);
      if (!song.rows[0]) {
        throw new NotFoundError('Gagal menambahkan lagu. Lagu tidak ditemukan');
      }
      const id = `playlist-song-${nanoid()}`;
      const createdAt = new Date().toISOString();
      const query = {
        text: 'INSERT INTO playlist_songs VALUES($1, $2, $3, $4) returning id',
        values: [id, playlistId, songId, createdAt],
      };
      const res = await client.query(query);
      if (!res.rows[0].id) {
        throw new InvariantError('Gagal menambahkan lagu ke playlist');
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  /**
   * Get all songs in playlist by id
   * @async
   * @param {{playlistId: string}} - Playlist Id
   * @return {Promise<object[]>} - Playlist with List of songs
   * @throws {NotFoundError}
   */
  async getAllSongsInPlaylistById({ playlistId }) {
    const client = await this.#dbService.getClient();
    try {
      await client.query('BEGIN');
      const queryPlaylist = {
        text: `SELECT playlists.id, name, username 
        FROM playlists LEFT JOIN users 
        ON playlists.owner = users.id 
        WHERE playlists.id = $1`,
        values: [playlistId],
      };

      const playlists = await this.#dbService.query(queryPlaylist);
      if (!playlists.rows[0]) {
        throw new NotFoundError('Playlist ID tidak ditemukan');
      }

      const querySongs = {
        text: `SELECT songs.id, title, performer
        FROM playlist_songs RIGHT JOIN songs 
        ON playlist_songs.song_id = songs.id
        WHERE playlist_songs.playlist_id = $1`,
        values: [playlistId],
      };

      const songs = await this.#dbService.query(querySongs);

      await client.query('COMMIT');

      playlists.rows[0].songs = songs.rows;
      return playlists.rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  /**
   * Delete song from playlist by id
   * @async
   * @param {{playlistId: string, songId: string}} - Playlist Id and Song Id
   * @returns {Promise<void>}
   * @throws {NotFoundError}
   */
  async deleteSongFromPlaylistById({ playlistId, songId }) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 returning id',
      values: [playlistId, songId],
    };
    const result = await this.#dbService.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus lagu dari playlist');
    }
  }
};
