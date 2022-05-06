const PlaylistsDAL = require('./playlistsDAL');
const Listener = require('./listener');

/**
 * Playlist Consumer RabbitMQ
 */
const playlistsConsumer = {
  listener: async ({ dbService, mailService }) => {
    const playlistsDAL = new PlaylistsDAL(dbService);
    const listener = new Listener({ playlistsDAL, mailService });
    return listener.listen;
  },
};
module.exports = playlistsConsumer;
