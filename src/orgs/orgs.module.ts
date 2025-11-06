import { Module } from '@nestjs/common';
import { OrgsService } from './orgs.service';
import { OrgsController } from './orgs.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [OrgsController],
  providers: [OrgsService],
})
export class OrgsModule {}
