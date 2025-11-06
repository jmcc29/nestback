import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { KeycloakService } from 'src/keycloak/keycloak.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, KeycloakService],
  exports: [AuthService],
})
export class AuthModule {}
