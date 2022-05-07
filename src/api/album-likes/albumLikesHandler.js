/**
 * Class to handle requests related to albums likes.
 * @class
 */
module.exports = class AlbumLikesHandler {
  /**
   * Album Data Access Layer.
   * @type {AlbumLikesDAL}
   * @private
   */
  #albumLikesDAL;

  /**
   * @constructor
   * @param {AlbumLikesDAL} albumLikesDAL
   */
  constructor(albumLikesDAL) {
    this.#albumLikesDAL = albumLikesDAL;
    this.postAlbumLikesHandler = this.postAlbumLikesHandler.bind(this);
    this.getAlbumLikesHandler = this.getAlbumLikesHandler.bind(this);
  }

  /**
   * Post Album Likes Handler.
   * @async
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   *
   * Steps:
   * 1. Check if album exists
   * 2. Check if like exist
   * 3. If not, create like
   * 4. If yes, delete like
   *
   * @return {Promise<response>} Hapi response object
   */
  async postAlbumLikesHandler(request, h) {
    const { albumId } = request.params;
    const { id: userId } = request.auth.credentials;
    await this.#albumLikesDAL.checkAlbumExists({ albumId });
    const isAlbumLiked = await this.#albumLikesDAL.isAlbumLiked({ albumId, userId });
    let message = 'Album ';
    if (isAlbumLiked) {
      await this.#albumLikesDAL.deleteAlbumLike({ albumId, userId });
      message += 'tidak lagi disukai';
    } else {
      await this.#albumLikesDAL.postAlbumLikes({ albumId, userId });
      message += 'berhasil disukai';
    }
    return h.response({
      status: 'success',
      message,
    }).code(201);
  }

  /**
   * Get Album Likes Handler.
   * @async
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   *
   * Count the number of likes for an album.
   * @return {Promise<response>} Hapi response object
   */
  async getAlbumLikesHandler(request, h) {
    const { albumId } = request.params;
    const albumLikes = await this.#albumLikesDAL.getAlbumLikes({ albumId });
    const likes = parseInt(albumLikes.count, 10);
    const result = h.response({
      status: 'success',
      data: {
        likes,
      },
    }).code(200);
    if (albumLikes.isCache) result.header('X-Data-Source', 'cache');
    return result;
  }
};
