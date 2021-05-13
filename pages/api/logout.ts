import withSession from '../../src/lib/withSession';

export default withSession(async (req, res) => {
  req.session.destroy();
  res.json({ isLoggedIn: false });
});
