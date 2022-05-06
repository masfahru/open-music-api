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
   * Get all songs in playlist by id
   * @async
   * @param {{playlistId: string}}
   *
   * Steps:
   * 1. Get playlist data
   * if the playlist not found, @throws {NotFoundError}
   * 2. Get all songs in the playlist
   * 3. Put the songs into playlist object
   *
   * @return {Promise<object[]>}
   */
  async getAllSongsInPlaylistById({ playlistId }) {
    const queryPlaylist = {
      text: `SELECT playlists.id, name, username 
        FROM playlists LEFT JOIN users 
        ON playlists.owner = users.id 
        WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const playlists = await this.#dbService.query(queryPlaylist);
    if (!playlists.rows[0]) {
      return [];
    }
    const querySongs = {
      text: `SELECT songs.id, title, performer
          FROM playlist_songs RIGHT JOIN songs 
          ON playlist_songs.song_id = songs.id
          WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    let songs = await this.#dbService.query(querySongs);
    if (!songs.rows[0]) {
      songs = [];
    }
    playlists.rows[0].songs = songs.rows;
    return playlists.rows[0];
  }
};
