const Hapi = require('@hapi/hapi');
const songs = require('./api/songs');
const albums = require('./api/albums');
const DbServices = require('./services/postgresql/dbService');
const { serverConfig } = require('./configs');

/**
 * Hapi server initialization
 * @async
 */
const init = async () => {
  const dbService = new DbServices();
  const server = Hapi.server({
    port: serverConfig.port,
    host: serverConfig.host,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: songs,
      options: {
        dbService,
      },
    },
    {
      plugin: albums,
      options: {
        dbService,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
