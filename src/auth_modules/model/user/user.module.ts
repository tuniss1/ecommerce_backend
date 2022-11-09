import { Module } from '@nestjs/common';
import { UserRepo } from '../../../auth_modules/repo';
import { UserService } from '../../service/auth/user.service';
import { UserController } from '../../controller/auth/user.controller';
import { MailService } from '../../../nmd_core/shared/mail.service';
import { HelperService } from '../../../nmd_core/shared/helper.service';
import { AuthMiddleware } from '../../../nmd_core/common/middlewares/bearer.middleware';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepo,
    MailService,
    HelperService,
    AuthMiddleware,
  ],
  exports: [UserService, UserRepo],
})
export class UserModule {}
