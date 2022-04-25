const Hapi = require('@hapi/hapi');
const { ClientError } = require('open-music-exceptions');
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
