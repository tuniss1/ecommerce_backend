import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { User, UserModel } from '../../model/user/user.model';

@Injectable()
export class UserRepo {
  constructor() {}

  async getByID(id: ObjectId): Promise<UserModel> {
    const userModel: UserModel = await User.findById(id);
    return userModel;
  }

  async getByEmail(email: string): Promise<UserModel> {
    const userModel: UserModel = await User.findOne({ email: email });
    return userModel;
  }

  async getByIdString(id: string): Promise<UserModel> {
    const userModel: UserModel = await User.findById({ _id: id });
    return userModel;
  }

  async getAll(): Promise<UserModel[]> {
    const res: UserModel[] = await User.find();

    return res;
  }

  async create(item: any): Promise<UserModel> {
    const newUser = new User(item);
    await newUser.save();
    return newUser;
  }

  async update(id: ObjectId, item: any) {
    const res = await User.findByIdAndUpdate(
      id,
      item,
      function (_: any, model: UserModel) {
        if (model) return model;
      },
    ).clone();

    return res;
  }

  async delete(id: ObjectId, item: any) {
    await this.update(id, item);

    const res = await this.getByID(id);

    return res;
  }
}
