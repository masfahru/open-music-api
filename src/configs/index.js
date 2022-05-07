require('dotenv').config();
const joi = require('joi');

// Create validator to validate the required environment variables
// https://dev.to/sukruozdemir/how-to-validate-environment-file-in-nodejs-m2m

/**
 * Required key from environment variables
 * NODE_ENV
 * HOST
 * PORT
 *
 * PGHOST
 * PGPORT
 * PGUSER
 * PGPASSWORD
 * PGDATABASE
 *
 * ACCESS_TOKEN_KEY
 * REFRESH_TOKEN_KEY
 *
 * RABBITMQ_SERVER
 *
 * MAIL_ADDRESS
 * MAIL_PASSWORD
 * MAIL_HOST
 * MAIL_PORT
 *
 * REDIS_SERVER
 */
// Joi Schema
const envVarsSchema = joi
  .object()
  .keys({
    NODE_ENV: joi
      .string()
      .valid('production', 'development', 'test')
      .required(),
    HOST: joi.string().hostname().required(),
    PORT: joi.number().port().required(),
    PGHOST: joi.string().hostname().required(),
    PGPORT: joi.number().port().required(),
    PGUSER: joi.string().required(),
    PGPASSWORD: joi.string().required(),
    PGDATABASE: joi.string().required(),
    ACCESS_TOKEN_KEY: joi.string().required(),
    REFRESH_TOKEN_KEY: joi.string().required(),
    RABBITMQ_SERVER: joi.string().required(),
    MAIL_ADDRESS: joi.string().email().required(),
    MAIL_PASSWORD: joi.string().required(),
    MAIL_HOST: joi.string().hostname().required(),
    MAIL_PORT: joi.number().port().required(),
    REDIS_SERVER: joi.string().hostname().required(),
  })
  .unknown(); // unknown keys other than in Joi schema are allowed

// Joi Validator
const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

// The application should fail as fast as possible and provide the immediate feedback
// if the required environment variables are not present at start-up
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

/**
 * @namespace serverConfig
 * @property {string} host
 * @property {number} port
 */
const serverConfig = { host: envVars.HOST, port: envVars.PORT };

/**
 * @namespace dbConfig
 * @property {string} host
 * @property {number} port
 * @property {string} user
 * @property {string} password
 * @property {string} database
 */
const dbConfig = {
  host: envVars.PGHOST,
  port: envVars.PGPORT,
  user: envVars.PGUSER,
  password: envVars.PGPASSWORD,
  database: envVars.PGDATABASE,
};

/**
 * @namespace jwtConfig
 * @property {string} accessTokenKey
 * @property {string} refreshTokenKey
 */
const jwtConfig = {
  accessTokenKey: envVars.ACCESS_TOKEN_KEY,
  refreshTokenKey: envVars.REFRESH_TOKEN_KEY,
};

/**
 * @namespace rabbitmqConfig
 * @property {string} host
 */
const rabbitmqConfig = { host: envVars.RABBITMQ_SERVER };

/**
 * @namespace mailConfig
 * @property {string} address
 * @property {string} password
 * @property {string} host
 * @property {number} port
 */
const mailConfig = {
  address: envVars.MAIL_ADDRESS,
  password: envVars.MAIL_PASSWORD,
  host: envVars.MAIL_HOST,
  port: envVars.MAIL_PORT,
};

const redisConfig = {
  host: envVars.REDIS_SERVER,
};

module.exports = {
  serverConfig,
  dbConfig,
  jwtConfig,
  rabbitmqConfig,
  mailConfig,
  redisConfig,
};
