import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { CustomRequest } from '../../../src/assets/ipaData';
import auth from '../../../src/lib/auth';
import Sound from '../../../src/models/Sound';
import User from '../../../src/models/User';

export default nextConnect()
  .use(auth)
  .use((req: CustomRequest, res: NextApiResponse, next) => {
    if (!req.session.get('user')) {
      res.status(401).send('unauthenticated');
    } else {
      next();
    }
  })
  .get(async (req: CustomRequest, res: NextApiResponse) => {
    const user = await User.findOne({ username: req.session.get('user').username }).populate('charts').exec();
    res.json({ charts: user.charts });
  })
  .post(async (req: CustomRequest, res: NextApiResponse) => {
    const { sounds, name } = req.body;
    const { username } = req.session.get('user');

    const user = await User.findOne({ username }).exec();

    const insertSounds = await Promise.all(sounds.map(async (sound) => {
      const s = await Sound.findOne({ name: sound.name }).exec();
      if (s) return s;
      return Sound.create(sound);
    }));

    user.charts.push({ sounds: insertSounds, name });
    user.markModified('charts');
    await user.save();

    res.json(user);
  });
