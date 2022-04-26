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
 * JWT_ACCESS_TOKEN_KEY
 * JWT_REFRESH_TOKEN_KEY
 */
// Joi Schema
const envVarsSchema = joi
  .object()
  .keys({
    NODE_ENV: joi
      .string()
      .valid('production', 'development', 'test')
      .required(),
    HOST: joi.string().required(),
    PORT: joi.number().port().required(),
    PGHOST: joi.string().required(),
    PGPORT: joi.number().port().required(),
    PGUSER: joi.string().required(),
    PGPASSWORD: joi.string().required(),
    PGDATABASE: joi.string().required(),
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

const serverConfig = { host: envVars.HOST, port: envVars.PORT };

const dbConfig = {
  host: envVars.PGHOST,
  port: envVars.PGPORT,
  user: envVars.PGUSER,
  password: envVars.PGPASSWORD,
  database: envVars.PGDATABASE,
};

module.exports = { serverConfig, dbConfig };
