import nextConnect from 'next-connect';
import { createUser } from '../../src/lib/user';
import auth from '../../src/lib/auth';
import User from '../../src/models/User';

export default nextConnect()
  .use(auth)
  .post(async (req, res) => {
    const { username, password, confirmPassword } = req.body;

    if (!username || !password || !confirmPassword) {
      return res.status(400).json({ error: { message: 'Missing fields' } });
    }

    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });

    if (await User.exists({ username })) return res.status(409).json({ message: 'That username is already taken' });

    await createUser({ username, password });

    // this will save the required cookie
    res.redirect('/api/login');
  });
