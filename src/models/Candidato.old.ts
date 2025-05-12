import mongoose, { Schema, Document } from 'mongoose';

// Interfaces para los tipos de datos
interface FormacionAcademica {
  titulo: string;
  institucion: string;
  anioInicio: number;
  anioFin?: number;
  enCurso?: boolean;
}

interface DatosPersonales {
  nombreCandidato: string;
  fechaNacimiento: string;
  urlFoto: string;
  sexo: string;
  numListaBoleta: string;
  poderPostula: string[];
  poderPostulaDescriptivo?: any[];
  cargoPostula: string;
  motivacionCargo: string;
}

interface Contacto {
  tipo: string;
  valor: string;
}

interface Candidatura {
  poder: string;
  cargo: string;
  periodo: string;
}

interface Propuestas {
  propuesta1?: string;
  propuesta2?: string;
  propuesta3?: string;
}

interface DatosAcademicos {
  gradoAcademico?: string;
  institucion?: string;
  anioGraduacion?: string;
  especialidad?: string;
  trayectoria?: any[];
  certificaciones?: any[];
}

// Interfaz del documento Candidato
export interface ICandidato extends Document {
  idCandidato?: number | string;
  datosPersonales: DatosPersonales;
  descripcionCandidato?: string;
  propuestas?: Propuestas;
  visionImparticionJusticia?: string;
  contacto: Contacto[];
  datosAcademicos?: DatosAcademicos;
  especialidad?: string;
  razonPostulacion?: string;
  formacionAcademica: FormacionAcademica[];
  candidaturas: Candidatura[];
  motivacion?: string;
  postulante?: string;
  organizacionPostulante?: string;
  nombreCorto?: string;
  tipoCandidato?: string;
  estatusVal?: number;
  idCircunscripcionEleccion?: number;
  idEstadoEleccion?: number;
  idSalaRegional?: number;
  idGrado?: number;
  descripcionTP?: string;
  descripcionHLC?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema de MongoDB para Candidato
const CandidatoSchema: Schema = new Schema(
  {
    idCandidato: { type: Schema.Types.Mixed },
    datosPersonales: {
      nombreCandidato: { type: String, required: true },
      fechaNacimiento: { type: String },
      urlFoto: { type: String },
      sexo: { type: String },
      numListaBoleta: { type: String },
      poderPostula: { type: [String], default: [] },
      poderPostulaDescriptivo: { type: [Schema.Types.Mixed], default: [] },
      cargoPostula: { type: String },
      motivacionCargo: { type: String }
    },
    descripcionCandidato: { type: String },
    // Propuestas guardadas directamente como campos
    propuesta1: { type: String },
    propuesta2: { type: String },
    propuesta3: { type: String },
    // Mantenemos también el objeto propuestas para compatibilidad
    propuestas: {
      propuesta1: { type: String },
      propuesta2: { type: String },
      propuesta3: { type: String }
    },
    visionImparticionJusticia: { type: String },
    datosAcademicos: {
      gradoAcademico: { type: String },
      institucion: { type: String },
      anioGraduacion: { type: String },
      especialidad: { type: String },
      trayectoria: { type: [Schema.Types.Mixed], default: [] },
      certificaciones: { type: [Schema.Types.Mixed], default: [] }
    },
    especialidad: { type: String },
    razonPostulacion: { type: String },
    formacionAcademica: [
      {
        titulo: { type: String },
        institucion: { type: String },
        anioInicio: { type: Number },
        anioFin: { type: Number },
        enCurso: { type: Boolean, default: false }
      }
    ],
    candidaturas: [
      {
        poder: { type: String },
        cargo: { type: String },
        periodo: { type: String }
      }
    ],
    contacto: [
      {
        tipo: { type: String },
        valor: { type: String }
      }
    ],
    motivacion: { type: String },
    postulante: { type: String },
    organizacionPostulante: { type: String },
    nombreCorto: { type: String },
    tipoCandidato: { type: String },
    estatusVal: { type: Number },
    idCircunscripcionEleccion: { type: Number },
    idEstadoEleccion: { type: Number },
    idSalaRegional: { type: Number },
    idGrado: { type: Number },
    descripcionTP: { type: String },
    descripcionHLC: { type: String }
  },
  { timestamps: true }
);

// Evitar errores de compilación en desarrollo por redefinición del modelo
export default mongoose.models.Candidato || mongoose.model<ICandidato>('Candidato', CandidatoSchema);
