import nextConnect from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import { createUser } from '../../src/lib/api/user';
import { asyncHandler, onError } from '../../src/lib/api/middleware';
import { withAuth } from '../../src/lib/api/auth';

export default nextConnect({ onError })
  .use(withAuth)
  .post(asyncHandler(async (req: NextApiRequest, res: NextApiResponse) => {
    const { username, password, confirmPassword } = req.body;

    if (!username || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    if (username.includes('/')) {
      return res.status(400).json({ message: 'No slashes allowed in usernames' });
    }

    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });

    if (await mongoose.model('User').exists({ username })) return res.status(409).json({ message: 'That username is already taken' });

    await createUser({ username, password });

    // this will save the required cookie
    res.redirect('/api/login');
  }));
