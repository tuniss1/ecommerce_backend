import {
  Controller,
  Post,
  Body,
  HttpCode,
  UsePipes,
  Req,
} from '@nestjs/common';
import {
  CheckVerifyReq,
  CreateUserReq,
  FcmTokenReq,
  GetUserReq,
  GmailVerifyReq,
  ResetPassReq,
} from '../../../auth_modules/request';
import { UserService } from '../../service/auth/user.service';
import { Request } from 'express';
import { ReturnInternalServerError } from '../../../nmd_core/common/utils/custom.error';
import { ValidationPipe } from '../../../nmd_core/common/pipes/validation.pipe';
import { AuthMiddleware } from '../../../nmd_core/common/middlewares/bearer.middleware';

@Controller('/user')
export class UserController {
  constructor(
    private userService: UserService,
    private authMiddleWare: AuthMiddleware,
  ) {}

  @Post('/createUser')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserReq: CreateUserReq) {
    try {
      const returnUserRes = await this.userService.createUser(createUserReq);

      return {
        statusCode: 200,
        message: 'Create user successfully',
        data: returnUserRes,
      };
    } catch (error) {
      if (error.status) throw error;
      else throw ReturnInternalServerError(error);
    }
  }

  @Post('/login')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async login(@Body() getUserReq: GetUserReq) {
    try {
      const returnUserRes = await this.userService.login(getUserReq);
      return {
        statusCode: 200,
        message: 'Login successfully.',
        data: returnUserRes,
      };
    } catch (error) {
      if (error.status) throw error;
      else throw ReturnInternalServerError(error);
    }
  }

  @Post('/gmailVerify')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async gmailVerify(@Body() gmailVerifyReq: GmailVerifyReq) {
    try {
      const gmailVeriRes = await this.userService.gmailVerify(gmailVerifyReq);
      return {
        statusCode: 200,
        message: 'Send mail verification successfully.',
        data: gmailVeriRes,
      };
    } catch (error) {
      if (error.status) throw error;
      else throw ReturnInternalServerError(error);
    }
  }

  @Post('/checkGmailVerify')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async checkGmailVerify(@Body() checkVerifyReq: CheckVerifyReq) {
    try {
      const verifyRes = await this.userService.checkGmailVerify(checkVerifyReq);
      return {
        statusCode: 200,
        message: 'Verification successfully.',
        data: verifyRes,
      };
    } catch (error) {
      if (error.status) throw error;
      else throw ReturnInternalServerError(error);
    }
  }

  @Post('/resetPassword')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async resetPassword(@Req() req: Request, @Body() resetPassReq: ResetPassReq) {
    const user = await this.authMiddleWare.validateBearer(req);

    try {
      const res = await this.userService.resetPassword(resetPassReq, user);
      return {
        statusCode: 200,
        message: 'Reset password successfully.',
        data: res,
      };
    } catch (error) {
      if (error.status) throw error;
      else throw ReturnInternalServerError(error);
    }
  }

  @Post('/fcmToken/create')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async createFcmToken(@Req() req: Request, @Body() fcmTokenReq: FcmTokenReq) {
    const user = await this.authMiddleWare.validateBearer(req);

    try {
      const res = await this.userService.createFcmToken(
        fcmTokenReq.fcmToken,
        user.id,
      );
      return {
        statusCode: 200,
        message: 'Create fcmToken successfully.',
        data: res,
      };
    } catch (error) {
      if (error.status) throw error;
      else throw ReturnInternalServerError(error);
    }
  }

  @Post('/fcmToken/remove')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async removeFcmToken(@Req() req: Request) {
    const user = await this.authMiddleWare.validateBearer(req);

    try {
      const res = await this.userService.removeFcmToken(user);
      return {
        statusCode: 200,
        message: 'Create fcmToken successfully.',
        data: res,
      };
    } catch (error) {
      if (error.status) throw error;
      else throw ReturnInternalServerError(error);
    }
  }
}
