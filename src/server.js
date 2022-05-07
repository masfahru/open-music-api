const Path = require('path');
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const { ClientError } = require('open-music-api-exceptions');
const { serverConfig, jwtConfig } = require('open-music-api-configs');
const songs = require('./api/songs');
const albums = require('./api/albums');
const users = require('./api/users');
const authentications = require('./api/authentications');
const playlists = require('./api/playlists');
const collaborations = require('./api/collaborations');
const exportPlaylist = require('./api/export-playlists');
const albumCovers = require('./api/album-covers');
const DbService = require('./services/sql/postgres/dbService');
const StorageService = require('./services/storage/local/storageService');
const messageBrokerService = require('./services/message-broker/rabbitmq/messageBrokerService');
const albumLikes = require('./api/album-likes');

/**
 * Hapi server initialization
 * @async
 */
const init = async () => {
  const dbService = new DbService();
  const storageService = new StorageService(Path.resolve(__dirname, 'api/public/uploads/images/'));
  const server = Hapi.server({
    port: serverConfig.port,
    host: serverConfig.host,
    routes: {
      cors: {
        origin: ['*'],
      },
      files: {
        relativeTo: Path.join(__dirname, 'api/public'),
      },
    },
  });

  await server.register([
    {
      plugin: Inert,
    },
    {
      plugin: Jwt,
    },
  ]);

  // Auth jwt Strategy
  server.auth.strategy('openmusicapi_jwt', 'jwt', {
    keys: jwtConfig.accessTokenKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: 1800,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
    {
      plugin: playlists,
      options: {
        dbService,
      },
    },
    {
      plugin: collaborations,
      options: {
        dbService,
      },
    },
    {
      plugin: exportPlaylist,
      options: {
        dbService,
        messageBrokerService,
      },
    },
    {
      plugin: albumCovers,
      options: {
        dbService,
        storageService,
      },
    },
    {
      plugin: albumLikes,
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

    if (response.isBoom) {
      if (response.output.statusCode === 500) {
        console.log(response);
      }
      const newResponse = h.response({
        status: response.output.payload.error,
        message: response.output.payload.message,
      });
      newResponse.code(response.output.payload.statusCode);
      return newResponse;
    }

    // if not error, return the response
    return response.continue || response;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
