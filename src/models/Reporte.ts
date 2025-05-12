import mongoose, { Schema, Document } from 'mongoose';

// Interfaz del documento Reporte
export interface IReporte extends Document {
  userId: string;
  candidatoId: string;
  tipoIrregularidad: string;
  descripcion: string;
  ubicacion?: {
    estado: string;
    municipio: string;
    colonia?: string;
    direccion?: string;
    coordenadas?: {
      latitud: number;
      longitud: number;
    }
  };
  evidencias?: string[]; // URLs de imágenes o documentos
  estado: 'pendiente' | 'en_revision' | 'confirmada' | 'rechazada';
  timestamp: Date;
  ip?: string;
  userAgent?: string;
}

// Schema de MongoDB para Reporte
const ReporteSchema: Schema = new Schema(
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
    tipoIrregularidad: { 
      type: String, 
      required: true,
      enum: [
        'compra_voto', 
        'coaccion', 
        'propaganda_ilegal', 
        'uso_recursos_publicos', 
        'violencia_electoral',
        'otro'
      ]
    },
    descripcion: { 
      type: String, 
      required: true 
    },
    ubicacion: {
      estado: String,
      municipio: String,
      colonia: String,
      direccion: String,
      coordenadas: {
        latitud: Number,
        longitud: Number
      }
    },
    evidencias: [String],
    estado: { 
      type: String, 
      enum: ['pendiente', 'en_revision', 'confirmada', 'rechazada'],
      default: 'pendiente'
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

// Evitar errores de compilación en desarrollo por redefinición del modelo
export default mongoose.models.Reporte || mongoose.model<IReporte>('Reporte', ReporteSchema);
