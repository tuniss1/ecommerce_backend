import { Injectable } from '@nestjs/common';
import {
  CheckVerifyReq,
  CreateUserReq,
  GetUserReq,
  GmailVerifyReq,
  RemoveUserReq,
  ResetPassReq,
} from '../../../auth_modules/request';
import {
  LoginUserRes,
  RegisterUserRes,
  UserRes,
} from '../../../auth_modules/response';
import { ReturnNotFoundException } from '../../../nmd_core/common/utils/custom.error';
import {
  comparePassword,
  generateToken,
  hashPassword,
} from '../../../nmd_core/common/utils/support-function';
import { ConfigService } from '../../../nmd_core/config';
import { MailService } from '../../../nmd_core/shared/mail.service';
import { UserRepo } from '../../../auth_modules/repo';
import { HelperService } from '../../../nmd_core/shared/helper.service';
import { ObjectId } from 'mongoose';
import { UserModel } from '../../model/user/user.model';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepo: UserRepo,
    private readonly mailService: MailService,
    private readonly helperService: HelperService,
  ) {}

  createToken(_userId: ObjectId, email: string) {
    const JWTKEY = this.configService.get('jwtKey');
    const TOKEN_EXPIRE_IN = this.configService.get('tokenExpireIn');

    const token = generateToken(JWTKEY, TOKEN_EXPIRE_IN, _userId, email);
    return token;
  }

  createShortTermToken(_userId: ObjectId, email: string) {
    const JWTKEY = this.configService.get('jwtKey');
    const TOKEN_EXPIRE_IN = this.configService.get('tokenExpireIn');

    const token = generateToken(JWTKEY, '15m', _userId, email);
    return token;
  }

  returnLoginRes(userModel: UserModel) {
    const returnUserRes: UserRes = {
      _id: userModel._id,
      email: userModel.email,
      firstName: userModel.firstName,
      lastName: userModel.lastName,
      photoUrl: userModel.photoUrl,
    };
    // Generate access token
    const accessToken = this.createToken(userModel._id, userModel.email);

    const returnLoginRes: LoginUserRes = {
      user: returnUserRes,
      authorization: {
        accessToken: accessToken,
      },
    };
    return returnLoginRes;
  }

  async createUser(createUserReq: CreateUserReq): Promise<RegisterUserRes> {
    // check user with email
    var getOldUser = await this.userRepo.getByEmail(
      createUserReq.email,
      'CUSTOMER',
    );
    if (getOldUser) throw ReturnNotFoundException('User already exist.');

    // hashed password and map req to model
    const hashedPassword = await hashPassword(createUserReq.password);

    // gen and hask token for mail verify
    const token = this.helperService.makeToken(6);
    const hashedToken = await hashPassword(token);

    const userModel = {
      email: createUserReq.email,
      hashedPassword: hashedPassword,
      firstName: createUserReq.firstName,
      lastName: createUserReq.lastName,
      hashedToken: hashedToken,
      status: 1,
    };

    const returnUser = await this.userRepo.create(userModel);

    const registerUserRes = this.returnLoginRes(returnUser);

    // this.mailService.gmailVerify(
    //   returnUser.email,
    //   returnUser.firstName + returnUser.lastName,
    //   token,
    // );

    return registerUserRes;
  }

  async createAdmin(createUserReq: CreateUserReq): Promise<RegisterUserRes> {
    // check user with email
    var getOldUser = await this.userRepo.getByEmail(
      createUserReq.email,
      'ADMIN',
    );
    if (getOldUser) throw ReturnNotFoundException('User already exist.');

    // hashed password and map req to model
    const hashedPassword = await hashPassword(createUserReq.password);

    // gen and hask token for mail verify
    const token = this.helperService.makeToken(6);
    const hashedToken = await hashPassword(token);

    const userModel = {
      email: createUserReq.email,
      hashedPassword: hashedPassword,
      firstName: createUserReq.firstName,
      lastName: createUserReq.lastName,
      hashedToken: hashedToken,
      role: 'ADMIN',
      status: 1,
    };

    const returnUser = await this.userRepo.create(userModel);

    const registerUserRes = this.returnLoginRes(returnUser);

    // this.mailService.gmailVerify(
    //   returnUser.email,
    //   returnUser.firstName + returnUser.lastName,
    //   token,
    // );

    return registerUserRes;
  }

  async login(getUserReq: GetUserReq): Promise<LoginUserRes> {
    if (!getUserReq.role) throw ReturnNotFoundException('Wrong role.');

    const returnUser = await this.userRepo.getByEmail(
      getUserReq.email,
      'CUSTOMER',
    );
    if (!returnUser) throw ReturnNotFoundException('Wrong email or password.');

    const checkPass = await comparePassword(
      getUserReq.password,
      returnUser.hashedPassword,
    );

    if (!checkPass) throw ReturnNotFoundException('Wrong email or password.');

    //map model -> response
    const returnLoginRes = this.returnLoginRes(returnUser);
    return returnLoginRes;
  }

  async loginAdmin(getUserReq: GetUserReq): Promise<LoginUserRes> {
    const returnUser = await this.userRepo.getByEmail(
      getUserReq.email,
      'ADMIN',
    );
    console.log(returnUser);
    if (!returnUser) throw ReturnNotFoundException('Wrong email or password.');

    const checkPass = await comparePassword(
      getUserReq.password,
      returnUser.hashedPassword,
    );

    if (!checkPass) throw ReturnNotFoundException('Wrong email or password.');

    //map model -> response
    const returnLoginRes = this.returnLoginRes(returnUser);
    return returnLoginRes;
  }

  async remove(removeUserReq: RemoveUserReq): Promise<UserModel> {
    const returnUser = await this.userRepo.getByEmail(
      removeUserReq.email,
      'CUSTOMER',
    );
    if (!returnUser) throw ReturnNotFoundException('Wrong email.');

    // Delete user
    await this.removeFcmToken(returnUser._id);
    const updateItem = { status: -1 };
    const returnRes = await this.userRepo.delete(returnUser._id, updateItem);

    return returnRes;
  }

  async getAll(): Promise<UserModel[]> {
    const res = await this.userRepo.getAll();

    return res;
  }

  async gmailVerify(gmailVerifyReq: GmailVerifyReq) {
    // check user with email
    const getOldUser = await this.userRepo.getByEmail(
      gmailVerifyReq.email,
      gmailVerifyReq.role,
    );
    if (!getOldUser) throw ReturnNotFoundException('User not found.');

    const token = this.helperService.makeToken(6);
    this.mailService.gmailVerify(
      getOldUser.email,
      getOldUser.firstName + getOldUser.lastName,
      token,
    );

    // hashed token
    const hashedToken = await hashPassword(token);
    getOldUser.hashedToken = hashedToken;
    this.userRepo.update(getOldUser._id, getOldUser);

    return;
  }

  async checkGmailVerify(checkVerifyReq: CheckVerifyReq) {
    // check user with email
    const getOldUser = await this.userRepo.getByEmail(
      checkVerifyReq.email,
      checkVerifyReq.role,
    );
    if (!getOldUser) throw ReturnNotFoundException('Verification failed.');

    const checkToken = await comparePassword(
      checkVerifyReq.otpCode,
      getOldUser.hashedToken,
    );
    if (!checkToken) throw ReturnNotFoundException('Verification failed.');

    getOldUser.isValid = true;
    getOldUser.hashedToken = this.helperService.makeToken(6); // regen random token
    this.userRepo.update(getOldUser._id, getOldUser);

    // Generate short term access token
    const accessToken = this.createShortTermToken(
      getOldUser._id,
      getOldUser.email,
    );
    return { accessToken: accessToken };
  }

  async resetPassword(resetPassReq: ResetPassReq, user: any) {
    // check user with email
    if (user.email != resetPassReq.email)
      throw ReturnNotFoundException('Reset password failed');

    const getOldUser = await this.userRepo.getByID(user.id);
    if (!getOldUser) throw ReturnNotFoundException('Reset password failed');

    const hashedPassword = await hashPassword(resetPassReq.password);
    getOldUser.hashedPassword = hashedPassword;
    this.userRepo.update(getOldUser._id, getOldUser);

    //map model -> response
    const returnLoginRes = this.returnLoginRes(getOldUser);
    return returnLoginRes;
  }

  async createFcmToken(fcmToken: string, userId: ObjectId) {
    const updateItem = { status: 1, fcmToken: fcmToken };
    const user = this.userRepo.update(userId, updateItem);
    return user;
  }

  async removeFcmToken(userId: ObjectId) {
    const updateItem = { status: 0, fcmToken: '' };
    const user = this.userRepo.update(userId, updateItem);
    return user;
  }
}
