import mongoose from 'mongoose';
import { EvolutionDocument } from '../lib/api/apiTypes';

const MatrixListDocument = {
  type: [{ symbol: String, features: String }],
  default: [],
  required: true,
};

const EvolutionSchema = new mongoose.Schema<EvolutionDocument>({
  rules: [{
    src: MatrixListDocument,
    dst: MatrixListDocument,
    preceding: MatrixListDocument,
    following: MatrixListDocument,
  }],
});

export default mongoose.models.Evolution || mongoose.model<EvolutionDocument>('Evolution', EvolutionSchema);
