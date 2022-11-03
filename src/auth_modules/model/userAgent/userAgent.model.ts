import mongoose, { ObjectId, Schema } from 'mongoose';
export class UserAgentModel {
  ip: String;
  userAgent: String;
  accessToken: String;
  isBlock: boolean;
  date: Date;
  numOfCall: Number;
  dataTransfer: Number;
}

// user schema migration
const UserAgentSchema = new Schema({
  //id: { type: mongoose.Schema.Types.ObjectId, ref: 'id' },
  ip: { type: String, default: '0.0.0.0' },
  userAgent: { type: String, default: '<undefined>' },
  accessToken: { type: String, default: '' },
  isBlock: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
  numOfCall: { type: Number, default: 0 },
  dataTransfer: { type: Number, default: 0 },
});

export const UserAgent = mongoose.model<UserAgentModel>(
  'UserAgent',
  UserAgentSchema,
);
