import * as mongoose from 'mongoose';
import * as types from '@/types';

const schema = new mongoose.Schema<types.User>({
  email: { type: String, required: true },
});

export const AllowedUser: mongoose.Model<types.User> = mongoose.models.AllowedUser || mongoose.model('AllowedUser', schema, 'allowed-users');