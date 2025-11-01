import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeycloakModule } from './keycloak/keycloak.module';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from './session/session.module';
import { OrgsModule } from './orgs/orgs.module';
import { ProjectsModule } from './projects/project.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [KeycloakModule, AuthModule, SessionModule, OrgsModule, ProjectsModule, TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
