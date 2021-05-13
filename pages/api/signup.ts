import dbConnect from '../../src/assets/dbconnect';
import { createUser } from '../../src/lib/user';
import withSession from '../../src/lib/withSession';
import User from '../../src/models/User';

export default withSession(async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (!username || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });

  await dbConnect();
  if (await User.exists({ username })) return res.status(409).json({ message: 'That username is already taken' });

  const user = await createUser({ username, password });

  console.log('USER:', user);

  res.redirect('/api/login');
});
