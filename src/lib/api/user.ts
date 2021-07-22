import crypto from 'crypto';
import mongoose from 'mongoose';

export async function createUser({ username, password }) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  const user = {
    username,
    hash,
    salt,
  };

  // This is an in memory store for users, there is no data persistence without a proper DB
  await mongoose.model('User').create(user);

  return { username, createdAt: Date.now() };
}

// Compare the password of an already fetched user (using `findUser`) and compare the
// password for a potential match
export function validatePassword(user, inputPassword) {
  const inputHash = crypto
    .pbkdf2Sync(inputPassword, user.salt, 1000, 64, 'sha512')
    .toString('hex');
  const passwordsMatch = user.hash === inputHash;
  return passwordsMatch;
}
