import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  HOST: string;
  ENVIRONMENT: string;

  FRONTEND_SERVERS: string[];
  // Keycloak configuration
  KEYCLOAK_HOST?: string;
  KEYCLOAK_PORT?: string;
  KEYCLOAK_REALM?: string;
  KEYCLOAK_CLIENT_ID?: string;
  KEYCLOAK_CLIENT_SECRET?: string;
  KEYCLOAK_ADMIN_USERNAME?: string;
  KEYCLOAK_ADMIN_PASSWORD?: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    HOST: joi.string().required(),
    ENVIRONMENT: joi.string().valid('prod', 'dev').required(),

    FRONTEND_SERVERS: joi.array().items(joi.string().uri()).default([]),
    // Keycloak configuration
    KEYCLOAK_HOST: joi.string().required(),
    KEYCLOAK_PORT: joi.string().required(),
    KEYCLOAK_REALM: joi.string().required(),
    KEYCLOAK_CLIENT_ID: joi.string().required(),
    KEYCLOAK_CLIENT_SECRET: joi.string().required(),
    KEYCLOAK_ADMIN_USERNAME: joi.string().optional(),
    KEYCLOAK_ADMIN_PASSWORD: joi.string().optional(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const BackendEnvs = {
  host: envVars.HOST,
  port: envVars.PORT,
  url: `http://${envVars.HOST}:${envVars.PORT}`,
  environment:  envVars.ENVIRONMENT,
};

export const FrontEnvs = {
    frontendServers: envVars.FRONTEND_SERVERS,
};

export const KeycloakEnvs = {
    host: envVars.KEYCLOAK_HOST,
    port: envVars.KEYCLOAK_PORT,
    url: `http://${envVars.KEYCLOAK_HOST}:${envVars.KEYCLOAK_PORT}`,
    realm: envVars.KEYCLOAK_REALM,
    clientId: envVars.KEYCLOAK_CLIENT_ID,
    clientSecret: envVars.KEYCLOAK_CLIENT_SECRET,
    adminUsername: envVars.KEYCLOAK_ADMIN_USERNAME,
    adminPassword: envVars.KEYCLOAK_ADMIN_PASSWORD,
};
