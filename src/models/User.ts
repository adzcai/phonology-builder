import mongoose from 'mongoose';

// also includes createdAt and updatedAt
const User = new mongoose.Schema({
  username: { type: String, required: true },
  hash: { type: String, required: true },
  salt: { type: String, required: true },

  charts: [
    {
      name: String,
      sounds: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sound' }],
        default: [],
      },
    },
  ],
});

export default mongoose.models.User || mongoose.model('User', User);
