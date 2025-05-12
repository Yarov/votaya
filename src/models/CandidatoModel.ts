import { prop, getModelForClass, modelOptions, Severity, Ref, pre } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import mongoose from 'mongoose';

// Enums
export enum TipoSexo {
  HOMBRE = 'H',
  MUJER = 'M'
}

export enum EstatusValidacion {
  VALIDO = 1,
  INVALIDO = 0
}

export enum TipoCandidato {
  PROPIO = 'P'
}

// Clases para propiedades anidadas
export class PoderPostulaDescriptivo {
  @prop({ required: true })
  public codigo!: string;

  @prop({ required: true })
  public descripcion!: string;
}

export class Propuestas {
  @prop()
  public propuesta1?: string;

  @prop()
  public propuesta2?: string;

  @prop()
  public propuesta3?: string;
}

export class DatosContacto {
  @prop()
  public correoElecPublico?: string;

  @prop()
  public telefonoPublico?: string;

  @prop()
  public paginaWeb?: string;
}

export class Contacto {
  @prop({ required: true })
  public tipo!: string;

  @prop({ required: true })
  public valor!: string;
}

export class RedSocial {
  @prop({ required: true })
  public idTipoRed!: number;
  
  @prop({ required: true })
  public descripcionRed!: string;
  
  @prop()
  public nombreRed?: string;
}

export class DatosPersonales {
  @prop({ required: true })
  public nombreCandidato!: string;

  @prop()
  public fechaNacimiento?: string;

  @prop()
  public urlFoto?: string;

  @prop({ enum: TipoSexo, type: String })
  public sexo?: string;

  @prop()
  public numListaBoleta?: string;

  @prop({ type: () => [Number], default: [] })
  public poderPostula?: number[];

  @prop({ type: () => [PoderPostulaDescriptivo], default: [] })
  public poderPostulaDescriptivo?: PoderPostulaDescriptivo[];

  @prop()
  public cargoPostula?: string;

  @prop()
  public motivacionCargo?: string;
}

export class DatosAcademicos {
  @prop()
  public gradoAcademico?: string;

  @prop()
  public institucion?: string;

  @prop()
  public anioGraduacion?: string;

  @prop()
  public especialidad?: string;

  @prop()
  public descripcion?: string;

  @prop({ type: () => [String], default: [] })
  public trayectoria?: string[];

  @prop({ type: () => [String], default: [] })
  public certificaciones?: string[];
}

export class FormacionAcademica {
  @prop()
  public titulo?: string;

  @prop()
  public institucion?: string;

  @prop()
  public anioInicio?: number;

  @prop()
  public anioFin?: number;

  @prop({ default: false })
  public enCurso?: boolean;
}

export class Candidatura {
  @prop()
  public poder?: string;

  @prop()
  public cargo?: string;

  @prop()
  public periodo?: string;
}

// Hook para asegurar que los datos requeridos estén presentes
@pre<Candidato>('save', function() {
  // Asegurar que datosPersonales exista
  if (!this.datosPersonales) {
    this.datosPersonales = {
      nombreCandidato: `Candidato ID ${this.idCandidato || 'desconocido'}`
    };
  }
  
  // Asegurar que contacto sea un array
  if (this.contacto && !Array.isArray(this.contacto)) {
    const contactoObj = this.contacto as unknown as DatosContacto;
    this.contacto = [];
    
    if (contactoObj.correoElecPublico) {
      this.contacto.push({ tipo: 'email', valor: contactoObj.correoElecPublico });
    }
    
    if (contactoObj.telefonoPublico) {
      this.contacto.push({ tipo: 'telefono', valor: contactoObj.telefonoPublico });
    }
    
    if (contactoObj.paginaWeb) {
      this.contacto.push({ tipo: 'web', valor: contactoObj.paginaWeb });
    }
  }
  
  // Si el contacto está vacío, agregar un valor por defecto
  if (!this.contacto || this.contacto.length === 0) {
    this.contacto = [{ tipo: 'no_especificado', valor: 'no_disponible' }];
  }
})

// Modelo principal de Candidato
@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'candidatos'
  },
  options: {
    allowMixed: Severity.ALLOW
  }
})
export class Candidato extends TimeStamps {
  @prop()
  public userHasVoted?: boolean;

  @prop({ default: 0 })
  public totalVotos?: number;

  @prop({ unique: true })
  public idCandidato?: number | string;

  @prop({ required: true, _id: false })
  public datosPersonales!: DatosPersonales;

  @prop()
  public descripcionCandidato?: string;

  @prop({ _id: false, default: {} })
  public propuestas?: Propuestas;

  // Campos directos para propuestas (para compatibilidad)
  @prop()
  public propuesta1?: string;

  @prop()
  public propuesta2?: string;

  @prop()
  public propuesta3?: string;

  @prop()
  public visionImparticionJusticia?: string;

  @prop({ type: () => [Contacto], default: [] })
  public contacto?: Contacto[];

  @prop({ _id: false })
  public datosAcademicos?: DatosAcademicos;

  @prop()
  public especialidad?: string;

  @prop()
  public razonPostulacion?: string;

  @prop({ type: () => [FormacionAcademica], default: [] })
  public formacionAcademica?: FormacionAcademica[];

  @prop({ type: () => [Candidatura], default: [] })
  public candidaturas?: Candidatura[];
  
  @prop({ type: () => [RedSocial], default: [] })
  public redesSociales?: RedSocial[];
  
  @prop({ type: () => [Object], default: [] })
  public cursosCandidatos?: any[];

  @prop()
  public motivacion?: string;
}

// Evitar la compilación duplicada del modelo en entornos de desarrollo con hot reloading
let model;

try {
  // Intentar obtener el modelo existente primero
  model = mongoose.model('Candidato');
} catch (error) {
  // Si el modelo no existe, crearlo
  model = getModelForClass(Candidato, {
    schemaOptions: {
      timestamps: true,
      collection: 'candidatos'
    },
    options: {
      allowMixed: Severity.ALLOW
    }
  });
}

export const CandidatoModel = model as mongoose.Model<Candidato & mongoose.Document>;
export default CandidatoModel
