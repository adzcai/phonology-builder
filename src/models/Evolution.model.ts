import mongoose from 'mongoose';
import { EvolutionDocument } from '../lib/api/apiTypes';

// stores an array of sounds
const MatrixListType = [{
  symbol: String,
  features: String, // the encoded features or 'boundary' or 'null'
}];

const EvolutionSchema = new mongoose.Schema<EvolutionDocument>({
  from: { type: String, ref: 'Chart' },
  rules: [{
    src: { type: MatrixListType, required: true },
    dst: { type: MatrixListType, required: true },
    preceding: MatrixListType,
    following: MatrixListType,
  }],
  to: { type: String, ref: 'Chart ' },
});

export default mongoose.models.Evolution || mongoose.model<EvolutionDocument>('Evolution', EvolutionSchema);
