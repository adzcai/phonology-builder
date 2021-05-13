import nextConnect from 'next-connect';
import auth from '../../../src/lib/auth';
import Sound from '../../../src/models/Sound';
import User from '../../../src/models/User';

export default nextConnect()
  .use(auth)
  .use((req, res, next) => {
    if (!req.session.get('user')) {
      res.status(401).send('unauthenticated');
    } else {
      next();
    }
  })
  .get(async (req, res) => {
    const user = await User.findOne({ username: req.session.get('user').username }).populate('charts').exec();
    res.json({ charts: user.charts });
  })
  .post(async (req, res) => {
    const { sounds, name } = req.body;
    const { username } = req.session.get('user');

    const user = await User.findOne({ username }).exec();

    console.log('LOADED:', user);

    const insertSounds = await Promise.all(sounds.map(async (sound) => {
      const s = await Sound.findOne({ name: sound.name }).exec();
      if (s) return s;
      return Sound.create(sound);
    }));

    user.charts.push({ sounds: insertSounds, name });
    user.markModified('charts');
    await user.save();

    console.log('AFTER', user);

    res.json(user);
  });
