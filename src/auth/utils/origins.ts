import { FrontEnvs } from '../../config/envs';
export function originOf(urlStr: string): string {
  const { origin } = new URL(urlStr);
  return origin.replace(/\/+$/, '');
}
export function deriveRedirectUri(returnTo: string, clientId: string) {
    const origin = originOf(returnTo);
    if (!FrontEnvs.frontendServers.includes(origin))
      throw new Error('Origen no permitido');
    return `${origin}/api/auth/callback`;
}

export function isOriginAllowed(origin: string): boolean {
    const cleanedOrigin = origin.replace(/\/+$/, '');
    return FrontEnvs.frontendServers.includes(cleanedOrigin);
}