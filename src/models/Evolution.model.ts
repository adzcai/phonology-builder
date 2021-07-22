import mongoose from 'mongoose';
import { EvolutionDocument } from '../lib/api/apiTypes';

const MatrixListDocument = {
  type: [{ symbol: String, features: String }],
  default: [],
  required: true,
};

const EvolutionSchema = new mongoose.Schema<EvolutionDocument>({
  from: { type: String, ref: 'Chart' },
  rules: [{
    src: MatrixListDocument,
    dst: MatrixListDocument,
    preceding: MatrixListDocument,
    following: MatrixListDocument,
  }],
  to: { type: String, ref: 'Chart ' },
});

export default mongoose.models.Evolution || mongoose.model<EvolutionDocument>('Evolution', EvolutionSchema);
