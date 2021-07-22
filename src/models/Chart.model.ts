import mongoose from 'mongoose';
import { ChartDocument } from '../lib/api/apiTypes';

const ChartSchema = new mongoose.Schema<ChartDocument>({
  _id: { type: String, required: true },
  username: { type: String, required: true },
  name: { type: String, required: true },
  sounds: {
    type: [{ symbol: String, features: String }],
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

export default mongoose.models.Chart || mongoose.model<ChartDocument>('Chart', ChartSchema);
