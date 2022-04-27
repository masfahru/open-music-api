const Hapi = require('@hapi/hapi');
const { ClientError } = require('open-music-api-exceptions');
const { serverConfig } = require('open-music-api-configs');
const songs = require('./api/songs');
const albums = require('./api/albums');
const users = require('./api/users');
const authentications = require('./api/authentications');
const DbService = require('./services/postgresql/dbService');

/**
 * Hapi server initialization
 * @async
 */
const init = async () => {
  const dbService = new DbService();
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
    {
      plugin: users,
      options: {
        dbService,
      },
    },
    {
      plugin: authentications,
      options: {
        dbService,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    // get response context from request
    const { response } = request;

    if (response instanceof ClientError) {
      // creating new response object based on the error
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    // if not error, return the response
    return response.continue || response;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
