import mongoose from 'mongoose';
import { User } from '../lib/types';

// also includes createdAt and updatedAt
const UserSchema = new mongoose.Schema<User>({
  username: { type: String, required: true },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  charts: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chart' }],
    default: [],
    required: true,
  },
});

export default mongoose.models.User || mongoose.model<User>('User', UserSchema);
