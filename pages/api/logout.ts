import nextConnect from 'next-connect';
import auth from '../../src/lib/auth';

export default nextConnect()
  .use(auth)
  .post(async (req, res) => {
    req.session.destroy();
    res.json({ isLoggedIn: false });
  });
