import * as mongoose from 'mongoose';
import * as types from '@/types';

const schema = new mongoose.Schema<types.User>({
  email: { type: String, required: true },
  refreshToken: {type: String, required: false},
  accessToken: {type: String, required: false}
});

export const User: mongoose.Model<types.User> = mongoose.models.User || mongoose.model('User', schema);