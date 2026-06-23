import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password?: string;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for OAuth
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
