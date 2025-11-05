import axios from 'axios';
import * as jose from 'jose-node-cjs-runtime';
import { Injectable } from '@nestjs/common';
import { KeycloakEnvs as kc } from '../config/envs';
import { KeycloakConnectOptions } from './interfaces/keycloak-connect';

@Injectable()
export class KeycloakService {
  createKeycloakConnectOptions(): KeycloakConnectOptions {
    return {
      authServerUrl: kc.url,
      realm: kc.realm || '',
      clientId: kc.clientId || '',
      secret: kc.clientSecret || '',
    };
  }
}
