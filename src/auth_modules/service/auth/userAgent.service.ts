import { Injectable } from '@nestjs/common';
import { UserAgentReq } from '../../../auth_modules/request';
import { UserAgentRepo } from '../../repo/auth/userAgent.repo';

@Injectable()
export class UserAgentService {
  constructor(private readonly userAgentRepo: UserAgentRepo) {}

  async checkUserAgent(userAgentReq: UserAgentReq) {
    // check user with email

    // // //Generate html email template body
    // const html = await ejs.renderFile(
    //   join('src', '../mails/', 'verifyAccount.ejs'),
    //   { fullName: '', token: '' },
    // );

    // // send the generated code to the user's email
    // this.mailService.sendEmail({
    //   from: `"BkE Server"`, // sender address
    //   to: 'ngominhdai92tn@gmail.com', // list of receivers
    //   subject: 'BkE - Email Verification OTP Code', // Subject line
    //   text: 'Welcome to BkE', // plain text body
    //   html, // html body
    // });

    const saveUserAgent = await this.userAgentRepo.insertOrUpdate(userAgentReq);

    return saveUserAgent;
  }

  async getAll({
    page,
    limit,
    searchIp,
    searchUserAgent,
    saerchAccessToken,
  }: {
    page?: number;
    limit?: number;

    searchIp?: string;
    searchUserAgent?: string;
    saerchAccessToken?: string;
  }) {
    if (!page || page <= 0) {
      page = 1;
    }
    if (!limit) {
      limit = 20;
    }

    return this.userAgentRepo.findAllAndPaging(
      {
        page,
        limit,
        sort: { created_time: -1 },
      },
      {
        ip: { $regex: searchIp ? searchIp : '' },
        userAgent: { $regex: searchUserAgent ? searchUserAgent : '' },
        accessToken: { $regex: saerchAccessToken ? saerchAccessToken : '' },
      },
    );
  }
}
