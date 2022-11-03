import { Body, Controller, Get, Query, Req, UsePipes } from '@nestjs/common';
import { UserAgentService } from '../../service/auth/userAgent.service';
import { ValidationPipe } from '../../../nmd_core/common/pipes/validation.pipe';
import { AuthMiddleware } from '../../../nmd_core/common/middlewares/bearer.middleware';
import { ReturnInternalServerError } from '../../../nmd_core/common/utils/custom.error';
import { Request } from 'express';
import { PagingPipe } from '../../../nmd_core/common/pipes/paging.pipe';

@Controller('/userAgent')
export class UserAgentController {
  constructor(
    private userAgentService: UserAgentService,
    private authMiddleWare: AuthMiddleware,
  ) {}

  @Get('')
  @UsePipes(new ValidationPipe())
  async getAll(
    @Req() req: Request,
    @Query(new PagingPipe())
    query: {
      page?: number;
      limit?: number;
      searchIp?: string;
      searchUserAgent?: string;
      saerchAccessToken?: string;
    },
  ) {
    //await this.authMiddleWare.validateBearer(req);

    try {
      const returnUserAgent = await this.userAgentService.getAll(query);

      return {
        statusCode: 200,
        message: 'Successfully',
        data: returnUserAgent,
      };
    } catch (error) {
      if (error.status) throw error;
      else throw ReturnInternalServerError(error);
    }
  }
}
