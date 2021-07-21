import mongoose from 'mongoose';
import { Chart } from '../lib/types';

const ChartSchema = new mongoose.Schema<Chart>({
  _id: String,
  name: { type: String, required: true },
  sounds: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sound' }],
    default: [],
    required: true,
  },
  words: {
    type: [String],
    default: [],
    required: true,
  },
  parent: {
    chart: { type: mongoose.Schema.Types.ObjectId, ref: 'Chart' },
    evolutionsFromParent: { type: mongoose.Schema.Types.ObjectId, ref: 'Evolution' },
  },
});

export default mongoose.models.Chart || mongoose.model<Chart>('Chart', ChartSchema);
