import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserReq {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class GetUserReq {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  role?: string;
}

export class RemoveUserReq {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class GmailVerifyReq {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  role?: string;
}

export class CheckVerifyReq {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  otpCode: string;

  role?: string;
}

export class ResetPassReq {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class FcmTokenReq {
  @IsString()
  @IsNotEmpty()
  fcmToken: string;
}
