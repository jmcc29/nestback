import { Inject, Injectable } from '@nestjs/common';
import { generatePkce, randomId } from './utils/pkce';
import { deriveRedirectUri } from './utils/origins';
import { PENDING_STORE, SESSION_STORE } from 'src/session/session.module';
import { PendingStore } from 'src/session/pending/pending.store';
import { SessionStore } from 'src/session/store/session.store';
import { authorizeEndpoint, logoutRequest, tokenRequest, umaRequest } from 'src/keycloak/keycloak.client';
import { LoginStartDto } from './dto/login-start.dto';
import { ExchangeDto } from './dto/exchange.dto';
import { SessionData } from 'src/session/session.types';
import { KeycloakEnvs } from 'src/config/envs';
import { peekRoles, peekSub, peekUserProfile } from './utils/jwt';
import { config } from '../../../nextfront/src/middleware';
@Injectable()
export class AuthService {
  constructor(
    @Inject(PENDING_STORE) private readonly pending: PendingStore,
    @Inject(SESSION_STORE) private readonly sessions: SessionStore,
  ) {}

  async buildLoginUrl({
    returnTo,
    clientId,
  }: LoginStartDto) {
    const { verifier, challenge } = generatePkce();
    const state = randomId();
    const redirectUri = deriveRedirectUri(returnTo, clientId);

    await this.pending.set(state, {
      codeVerifier: verifier,
      clientId,
      redirectUri,
      returnTo,
      createdAt: Date.now(),
    });

    const url = new URL(authorizeEndpoint());
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'openid profile email');
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('state', state);
    url.searchParams.set('code_challenge', challenge);
    url.searchParams.set('code_challenge_method', 'S256');

    return { url: url.toString(), state };
  }
  
  async exchangeCode({
    code,
    state,
    sidCookie,
  }: ExchangeDto) {
    const stash = await this.pending.take(state);
    if (!stash) throw new Error('State no encontrado o expirado');

    const { clientId, codeVerifier, redirectUri, returnTo } = stash;

    const secret = KeycloakEnvs.clientSecret;

    const data = await tokenRequest({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: secret ?? '',
      code,
      code_verifier: codeVerifier,
      redirect_uri: redirectUri,
    });

    const now = Date.now();
    const expiresAt = now + (data.expires_in ?? 300) * 1000;
    const sub = peekSub(data.access_token);
    const roles = peekRoles(data.access_token, clientId);

    const sessionId = sidCookie ?? randomId();
    const existing =
      (await this.sessions.get(sessionId)) ??
      ({
        tokenType: data.token_type ?? 'Bearer',
        sub,
        clients: {},
      } as SessionData);

    existing.tokenType = data.token_type ?? existing.tokenType ?? 'Bearer';
    existing.sub = existing.sub ?? sub;
    existing.clients[clientId] = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      idToken: data.id_token,
      expiresAt,
      roles,
    };

    await this.sessions.set(sessionId, existing);
    await this.sessions.gc();

    return { sid: sessionId, returnTo };
  }

  async logout(sid: string): Promise<void> {
    
    if (!sid) return;
    const session = await this.sessions.get(sid);
    if (!session) return;

    const clientId = KeycloakEnvs.clientId;
    const clientSecret = KeycloakEnvs.clientSecret;
    const refreshToken = clientId ? session.clients?.[clientId]?.refreshToken : undefined;

    if (clientId && refreshToken) {
      try {
        await logoutRequest(
          refreshToken,
          {
            id: clientId,
            secret: clientSecret,
          },
        );
      } catch (e: any) {
        console.error('Error during Keycloak logout request:', e?.message || e);
      }
    }

    await this.sessions.del(sid);
  }
  
  async getProfile(sid: string): Promise<any> {
    const session = await this.sessions.get(sid);
    if (!session) throw new Error('Sesión no encontrada');

    const clientId = KeycloakEnvs.clientId;
    const accessToken = clientId ? session.clients?.[clientId]?.accessToken : undefined;
    if (!accessToken) throw new Error('No hay token de acceso en la sesión');

    const profile = peekUserProfile(accessToken);
    return profile;
  }

  async getPermissions(sid: string, clientId: string, audience: string): Promise<string[]> {
    const session = await this.sessions.get(sid);
    if (!session) throw new Error('Sesión no encontrada');
    const accessToken = clientId ? session.clients?.[clientId]?.accessToken : undefined;
    if (!accessToken) throw new Error('No hay token de acceso en la sesión');
    const permissions= await umaRequest({
      accessToken,
      audience,
      responseMode: 'permissions',
    })
    return permissions;
  }

  async evaluatePermission(sid: string, clientId: string, audience: string, permission: string) {
    const session = await this.sessions.get(sid);
    if (!session) throw new Error('Sesión no encontrada');
    const accessToken = clientId ? session.clients?.[clientId]?.accessToken : undefined;
    if (!accessToken) throw new Error('No hay token de acceso en la sesión');
    const permissions= await umaRequest({
      accessToken,
      audience,
      responseMode: 'decision',
      permission, // "resource#scope"
    })
    return permissions;
  }
}
