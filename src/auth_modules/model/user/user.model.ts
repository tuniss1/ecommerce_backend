import mongoose, { ObjectId, Schema } from 'mongoose';

export class UserModel {
  _id: ObjectId;
  email: string;
  phone: string;
  hashedPassword: string;
  firstName: string;
  lastName: string;
  facebookID: string;
  googleID: string;
  createdAt: Number;
  photoUrl: string;
  isValid: boolean;
  hashedToken: string;
  point: Number;
  role: string;
  status: number; // -1: delete, 0: offline, 1: online

  fcmToken: string;
}

// user schema migration
const UserSchema = new Schema({
  //id: { type: mongoose.Schema.Types.ObjectId, ref: 'id' },
  email: { type: String },
  phone: { type: String },
  hashedPassword: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  facebookID: { type: String, default: '' },
  googleID: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now() },
  photoUrl: {
    type: String,
    default: 'https://i.imgur.com/tMiDwCE.png',
  },
  isValid: { type: Boolean, default: false },
  hashedToken: { type: String, default: '200701' },
  point: { type: Number, default: 0 },
  role: { type: String, default: 'CUSTOMER' },
  status: { type: Number, default: 0 },

  fcmToken: { type: String, default: '' },
});

export const User = mongoose.model<UserModel>('User', UserSchema);
