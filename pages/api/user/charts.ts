import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import auth from '../../../src/lib/auth';
import { userToJson } from '../../../src/lib/user';
import { CustomRequest, Sound } from '../../../src/lib/types';
import { UserModel, SoundModel, ChartModel } from '../../../src/models';
import { serializeSound } from '../../../src/assets/ipa-data';

export default nextConnect()
  .use(auth)
  .use((req: CustomRequest, res: NextApiResponse, next) => {
    if (!req.session.get('user')) {
      res.status(401).send('Unauthenticated');
    } else {
      next();
    }
  })
  .get(async (req: CustomRequest, res: NextApiResponse) => {
    const user = await UserModel.findOne({ username: req.session.get('user').username })
      .populate('charts').exec();
    res.json({ charts: user.charts });
  })
  .post(async (req: CustomRequest, res: NextApiResponse) => {
    const { sounds, name } = req.body;
    const { username } = req.session.get('user');

    const user = await UserModel.findOne({ username }).exec();

    const insertSounds = await Promise.all<Sound>(sounds.map(async (sound: Sound) => {
      const s = await SoundModel.findOne({ symbol: sound.symbol }).exec();
      if (s) return s;
      return SoundModel.create(serializeSound(sound));
    }));

    try {
      const chart = await ChartModel.create({
        _id: `${username}/${name}`, sounds: insertSounds, name, parent: null,
      });

      user.charts.push(chart);
      user.markModified('charts');
      await user.save();
      res.json(userToJson(user));
    } catch (e) {
      console.error('Error when saving new chart:', e);
      res.status(409).json({ errorMessage: e.message });
    }
  });
