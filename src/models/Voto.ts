import mongoose, { Schema, Document } from 'mongoose';

// Interfaz del documento Voto
export interface IVoto extends Document {
  userId: string;
  candidatoId: string;
  timestamp: Date;
  ip?: string;
  userAgent?: string;
}

// Schema de MongoDB para Voto
const VotoSchema: Schema = new Schema(
  {
    userId: { 
      type: String, 
      required: true,
      index: true
    },
    candidatoId: { 
      type: String, 
      required: true,
      index: true
    },
    timestamp: { 
      type: Date, 
      default: Date.now 
    },
    ip: String,
    userAgent: String
  },
  { timestamps: true }
);

// Índice compuesto para evitar votos duplicados del mismo usuario para el mismo candidato
VotoSchema.index({ userId: 1, candidatoId: 1 }, { unique: true });

// Evitar errores de compilación en desarrollo por redefinición del modelo
export default mongoose.models.Voto || mongoose.model<IVoto>('Voto', VotoSchema);
