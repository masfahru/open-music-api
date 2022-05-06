module.exports = class Listener {
/**
 * Playlist DAL
 * @private
 */
  #playlistsDAL;

  /**
 * Mail Service
 * @private
 */
  #mailService;

  /**
   * @constructor
   * @param {{playlistsDAL: PlaylistsDAL, mailService: MailService}}
   */
  constructor({ playlistsDAL, mailService }) {
    this.#playlistsDAL = playlistsDAL;
    this.#mailService = mailService;
    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString());
      const playlist = await this.#playlistsDAL.getAllSongsInPlaylistById({ playlistId });
      if (playlist) {
        const result = await this.#mailService.sendEmail({ targetEmail, playlist });
        console.log(result);
      } else {
        console.log(`Playlist ${playlistId} not found`);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};
