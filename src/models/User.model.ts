import mongoose from 'mongoose';
import { UserDocument } from '../lib/api/apiTypes';

// also includes createdAt and updatedAt
const UserSchema = new mongoose.Schema<UserDocument>({
  username: { type: String, required: true },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
});

export default mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);
