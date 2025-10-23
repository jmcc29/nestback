import axios from 'axios';
import { KeycloakEnvs } from '../config/envs';
import { UmaDecisionReq, UmaPermissionsReq } from './interfaces';

const base = KeycloakEnvs.url || 'http://localhost:8080/auth';
const realm = KeycloakEnvs.realm || 'master';
const clientId= KeycloakEnvs.clientId;
const clientSecret= KeycloakEnvs.clientSecret;

function tokenEndpoint() {
  return `${base}/realms/${encodeURIComponent(realm)}/protocol/openid-connect/token`;
}
function logoutEndpoint() {
  return `${base}/realms/${encodeURIComponent(realm)}/protocol/openid-connect/logout`;
}
export function authorizeEndpoint() {
  return `${base}/realms/${encodeURIComponent(realm)}/protocol/openid-connect/auth`;
}



export async function tokenRequest(body: Record<string, string>) {
  const { data } = await axios.post(tokenEndpoint(), new URLSearchParams(body), {
    headers: { 'content-type': 'application/x-www-form-urlencoded' }, timeout: 10000,
  });
  return data;
}

export async function logoutRequest(refreshToken: string, client: { id: string; secret?: string }) {
  const body = new URLSearchParams();
  body.set('client_id', client.id);
  if (client.secret) body.set('client_secret', client.secret);
  body.set('refresh_token', refreshToken);
  await axios.post(logoutEndpoint(), body, {
    headers: { 'content-type': 'application/x-www-form-urlencoded' }, timeout: 8000,
  });
}

export async function umaRequest(
  req: UmaPermissionsReq | UmaDecisionReq,
): Promise<any> {
  const body = new URLSearchParams();
  body.set('grant_type', 'urn:ietf:params:oauth:grant-type:uma-ticket');
  body.set('audience', req.audience);
  body.set('response_mode', req.responseMode);

  if ('permission' in req && req.permission) {
    body.set('permission', req.permission);
  }

  const { data } = await axios.post(tokenEndpoint(), body, {
    headers: {
      authorization: `Bearer ${req.accessToken}`,
      'content-type': 'application/x-www-form-urlencoded',
    },
    timeout: 10_000,
  });

  return data;
}