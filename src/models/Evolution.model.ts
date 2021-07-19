import mongoose from 'mongoose';
import { Evolution } from '../lib/types';

const EvolutionSchema = new mongoose.Schema<Evolution>({
  rules: [{
    src: [{ type: mongoose.Types.ObjectId, ref: 'Sound' }],
    dst: [{ type: mongoose.Types.ObjectId, ref: 'Sound' }],
    preceding: [{ type: mongoose.Types.ObjectId, ref: 'Sound' }],
    following: [{ type: mongoose.Types.ObjectId, ref: 'Sound' }],
  }],
});

export default mongoose.models.Evolution || mongoose.model<Evolution>('Evolution', EvolutionSchema);
