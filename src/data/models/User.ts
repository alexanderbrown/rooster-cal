import * as mongoose from 'mongoose';

export interface IUser {
  email: string;
}

const schema = new mongoose.Schema<IUser>({
  email: { type: String, required: true },
});

export const User = mongoose.models.User || mongoose.model('User', schema);