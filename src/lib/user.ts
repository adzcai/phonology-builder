import crypto from 'crypto';
import User from '../models/User';

export function userToJson(user: { username: string, charts?: { name: string, sounds: any[] }[] }) {
  return {
    data: {
      isLoggedIn: true,
      username: user.username,
      charts: user.charts?.map(({ name, sounds }) => ({
        name,
        sounds: sounds
          .map((s) => Object.keys(s.toJSON())
            .reduce((prev, curr) => ({ ...prev, [curr]: ['true', 'false', '0'].includes(s[curr]) ? JSON.parse(s[curr]) : s[curr] }), {})),
      })),
    },
  };
}

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
  await User.create(user);

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
