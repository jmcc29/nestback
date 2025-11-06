import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { KeycloakService } from 'src/keycloak/keycloak.service';
import { KeycloakEnvs } from 'src/config/envs';

@Injectable()
export class ValidTokenGuard implements CanActivate {
  constructor(private readonly keycloak: KeycloakService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const auth = req.headers['authorization'] as string | undefined;
    if (!auth?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Falta Authorization: Bearer');
    }
    const token = auth.slice('Bearer '.length);

    try {
      const { payload } = await this.keycloak.verifyAccessToken(token, {
        azp: KeycloakEnvs.clientId, // ✅ validando azp
        clockSkewSec: 90,
      });
      req.user = {
        sub: payload.sub,
        azp: payload.azp,
        exp: payload.exp,
      };
      return true;
    } catch (e) {
      // Diferencia entre token inválido/expirado vs prohibido, si quieres
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
