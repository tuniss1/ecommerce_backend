import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '../config';
import * as ejs from 'ejs';
import { join } from 'path';
import { HelperService } from './helper.service';

@Injectable()
export class MailService {
  private readonly mailAddress: string;
  private readonly mailPassword: string;

  constructor(private configService: ConfigService) {
    this.mailAddress = this.configService.get('mailAddress');
    this.mailPassword = this.configService.get('mailPassword');
  }

  async gmailVerify(mail: string, fullName: string, token: string) {
    // Generate forgot password token

    // //Generate html email template body
    const html = await ejs.renderFile(
      join('src', '../mails/', 'verifyAccount.ejs'),
      { fullName: fullName, token: token },
    );

    // send the generated code to the user's email
    this.sendEmail({
      from: `"BkE Education Inc."`, // sender address
      to: mail, // list of receivers
      subject: 'BkE - Email Verification OTP Code', // Subject line
      text: 'Welcome to BkE', // plain text body
      html, // html body
    });
  }

  async sendEmail(data: {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
    attachments?: any[];
  }) {
    try {
      data.from = data.from + `<${this.mailAddress}>`;
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: this.mailAddress, // generated ethereal user
          pass: this.mailPassword, // generated ethereal password
        },
      });
      const info = await transporter.sendMail(data);
      console.log('Send Mail to ', data.to, 'and ID message: ', info.messageId);
    } catch (err) {
      console.log('Failed Send Mail: ', err.message);
    }
  }
}
