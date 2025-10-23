import * as request from 'supertest';
export type TokenResponse = {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  token_type: string;
  expires_in: number;
  scope?: string;
  session_state?: string;
};

export type VerifyResult = { isValid: boolean; sub?: string; exp?: number; azp?: string };

export type UmaPermissionsReq = {
  accessToken: string;
  audience: string;
  responseMode: 'permissions';
};

export type UmaDecisionReq = {
  accessToken: string;
  audience: string;
  responseMode: 'decision';
  permission: string; // "rsname#scope"
};

export interface KeycloakRequest {
    accessToken: string;
    clientId: string;
    audience?: string;
    responseMode?: string;
    returnUrl?: string;
    redirectUri?: string;
}