import mongoose from 'mongoose';

// also includes createdAt and updatedAt
const User = new mongoose.Schema({
  username: { type: String, required: true },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
});

export default mongoose.models.User || mongoose.model('User', User);
