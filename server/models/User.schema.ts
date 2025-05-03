import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  id: string;
  profile: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    profile: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false, 
  }
);

export default mongoose.model<IUser>('User', UserSchema);