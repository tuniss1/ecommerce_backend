import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { ObjectId } from 'mongoose';

export const generateToken = function (
  key: string,
  tokenExpireIn: string,
  id: ObjectId,
  email: string,
): string {
  return jwt.sign({ id: id, email: email }, key, {
    expiresIn: tokenExpireIn,
  });
};

export const hashPassword = async function (password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async function (
  password: string,
  hashPassword: string,
) {
  return await bcrypt.compare(password, hashPassword);
};

export const checkSuperAdminKey = async function () {};
