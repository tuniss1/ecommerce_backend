import { Module } from '@nestjs/common';
import { UserAgentService } from '../../service/auth/userAgent.service';
import { UserAgentRepo } from '../../repo/auth/userAgent.repo';
import { UserAgentController } from '../../controller/auth/userAgent.controller';
import { ResponseService } from '../../../nmd_core/shared/response.service';
import { AuthMiddleware } from '../../../nmd_core/common/middlewares/bearer.middleware';
import { UserRepo } from '../../repo/auth/user.repo';

@Module({
  imports: [],
  controllers: [UserAgentController],
  providers: [
    UserAgentService,
    UserAgentRepo,
    ResponseService,
    AuthMiddleware,
    UserRepo,
  ],
  exports: [UserAgentService, UserAgentRepo],
})
export class UserAgentModule {}
