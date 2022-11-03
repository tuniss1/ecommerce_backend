import {
  ReturnNotFoundException,
  ReturnUnauthorizedException,
} from '../utils/custom.error';
import { NextFunction, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '../../config';
import { Injectable } from '@nestjs/common';
import { UserRepo } from '../../../auth_modules/repo/auth/user.repo';

@Injectable()
export class AuthMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepo: UserRepo,
  ) {}

  async validateBearer(req: Request) {
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace('Bearer ', '');
      if (!token) throw ReturnUnauthorizedException();

      const JWT_KEY = this.configService.get('jwtKey');
      const payload = jwt.verify(token, JWT_KEY, (err, decoded) => {
        if (err && err.name === 'TokenExpiredError') {
          throw ReturnUnauthorizedException();
        }

        return decoded;
      }) as any;
      if (!payload) throw ReturnNotFoundException('Invalid token');

      const user = await this.userRepo.getByID(payload.id);
      if (!user) throw ReturnUnauthorizedException();
      console.log('UserID: ', payload.id, ' and email: ', user.email);
      return payload;
    } else {
      throw ReturnUnauthorizedException();
    }
  }

  async use(req: Request, res: Response, next: NextFunction) {
    await this.validateBearer(req);
  }
}
