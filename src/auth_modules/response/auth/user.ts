import { ObjectId } from 'mongoose';

export class UserRes {
  _id: ObjectId;
  email: string;
  fullName: string;
  photoUrl: string;
}

export class Authorization {
  accessToken: string;
}

export class LoginUserRes {
  user: UserRes;
  authorization: Authorization;
}

export class RegisterUserRes {
  user: UserRes;
  authorization: Authorization;
}
