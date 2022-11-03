import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import {
  FgBlue,
  FgGreen,
  FgRed,
  FgWhite,
  FgYellow,
  Reset,
} from '../constant/logger.color';

import * as requestIp from 'request-ip';
import { UserAgentService } from '../../../auth_modules/service/auth/userAgent.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly userAgentService: UserAgentService) {}

  private logger = new Logger('HTTP');
  use(req: Request, res: Response, next: NextFunction) {
    var ip: any;
    if (req.clientIp) ip = req.clientIp;
    else ip = requestIp.getClientIp(req);

    const { method, originalUrl } = req;
    const startAt = process.hrtime();
    var userAgent = req.get('user-agent') || '<user-agent>';

    res.on('finish', () => {
      const { statusCode } = res;

      // handle reponse time
      const diff = process.hrtime(startAt);
      const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
      var convertResponseTime = `${responseTime.toFixed(0)}ms`;
      if (responseTime > 1000)
        convertResponseTime = `${(responseTime / 1000).toFixed(2)}s`;

      // handle statusCode
      var returnStatusCode = `${FgGreen}${statusCode}${Reset}`;
      if (statusCode != 200) {
        returnStatusCode = `${FgRed}${statusCode}${Reset}`;
      }

      // handle content length
      const dataTransfer = res.get('Content-Length');
      var convertContentLength = 0;
      try {
        if (!dataTransfer) convertContentLength = 512000;
        else convertContentLength = parseInt(dataTransfer);
      } catch (error) {
        this.logger.error(`500 from convert content length: ${error}`);
      }

      // var contentLength: string;

      // if (convertContentLength < 1024) {
      //   convertContentLength = convertContentLength * 4;
      //   contentLength = `${FgBlue}${convertContentLength.toFixed(0)}B${Reset}`;
      // } else if (convertContentLength < 1048576) {
      //   convertContentLength = convertContentLength / 1024;
      //   contentLength = `${FgBlue}${convertContentLength.toFixed(2)}KB${Reset}`;
      // } else {
      //   // (parseFloat(contentLength) > 1048576)
      //   convertContentLength = convertContentLength / 1048576;
      //   contentLength = `${FgRed}${convertContentLength.toFixed(2)}MB${Reset}`;
      // }

      if (
        ip != '0.1.0.2' && // app engine
        ip != '::1' && // postman localhost
        userAgent !=
          'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)' // fb bot
      ) {
        // ip google cloud cron job
        this.logger.log(
          `ip=${FgWhite}${ip}${Reset} ${FgYellow}${method}${Reset} ${originalUrl} ${returnStatusCode} ${convertResponseTime} ${dataTransfer} ${userAgent} `,
        );
        const regexUserAgent = '[(\\[]([^()\\[\\]]*)[)\\]]';

        const tempList = userAgent.match(regexUserAgent);

        if (tempList == null) {
          this.logger.error(
            `>>>>>>>>>>> DANGER: userAgent = ${userAgent} <<<<<<<<<<<<<<<`,
          );
        } else {
          userAgent = tempList[1];
        }

        // check usserAgent
        this.userAgentService.checkUserAgent({
          ip: ip,
          userAgent: userAgent,
          accessToken: req.headers.authorization?.replace('Bearer ', '') ?? '',
          dataTransfer: convertContentLength,
        });
      }
    });

    next();
  }
}
