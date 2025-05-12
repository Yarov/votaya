export type TipoSexo = 'H' | 'M' | string;

export enum EstatusValidacion {
  VALIDO = 1,
  INVALIDO = 0
}

export enum TipoCandidato {
  PROPIO = 'P'
}

export interface Propuestas {
  propuesta1?: string;
  propuesta2?: string;
  propuesta3?: string;
}

export interface DatosContacto {
  correoElecPublico?: string;
  telefonoPublico?: string;
  paginaWeb?: string;
}

export interface PoderPostulaDescriptivo {
  codigo: string;
  descripcion: string;
}

export interface DatosPersonales {
  nombreCandidato: string;
  fechaNacimiento?: string;
  urlFoto?: string;
  sexo?: TipoSexo;
  numListaBoleta?: string;
  poderPostula?: number[] | any[];
  poderPostulaDescriptivo?: PoderPostulaDescriptivo[];
  cargoPostula?: string;
  motivacionCargo?: string;
}

export interface DatosAcademicos {
  gradoAcademico?: string;
  institucion?: string;
  anioGraduacion?: string;
  especialidad?: string;
  descripcion?: string;
  trayectoria?: string[];
  certificaciones?: string[];
}

export interface ExperienciaProfesional {
  cargo?: string;
  institucion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  descripcion?: string;
}

export interface FormacionAcademica {
  grado?: string;
  institucion?: string;
  anio?: string;
  especialidad?: string;
}

export interface Publicacion {
  titulo?: string;
  anio?: string;
  descripcion?: string;
}

export interface Logro {
  titulo?: string;
  anio?: string;
  descripcion?: string;
}

export interface Reconocimiento {
  titulo?: string;
  institucion?: string;
  anio?: string;
  descripcion?: string;
}

export interface RedSocial {
  idTipoRed: number;
  descripcionRed: string;
  nombreRed?: string;
}

export interface CursoCandidato {
  idCurso?: number;
  nombreCurso?: string;
  institucion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  descripcion?: string;
}

export interface Candidato {
  userHasVoted?: boolean;
  totalVotos?: number;
  _id?: string;
  idCandidato?: number | string;
  datosPersonales: DatosPersonales;
  descripcionCandidato?: string;
  propuestas?: Propuestas;
  visionImparticionJusticia?: string;
  contacto?: DatosContacto;
  datosAcademicos?: DatosAcademicos;
  estatusVal?: EstatusValidacion | number;
  especialidad?: string;
  nombreCorto?: string;
  razonPostulacion?: string;
  formacionAcademica?: FormacionAcademica[];
  experienciaProfesional?: ExperienciaProfesional[];
  publicaciones?: Publicacion[];
  logros?: Logro[];
  reconocimientos?: Reconocimiento[];
  candidaturas?: any[];
  redesSociales?: RedSocial[];
  cursosCandidatos?: CursoCandidato[];
  motivacion?: string;
  postulante?: string;
  organizacionPostulante?: string;
  // Campos adicionales del JSON original
  tipoCandidato?: string;
  idCircunscripcionEleccion?: number;
  idEstadoEleccion?: number;
  idSalaRegional?: number;
  idGrado?: number;
  descripcionTP?: string;
  descripcionHLC?: string;
  // Campos de sistema
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CatalogoResponse {
  fecha: string;
  candidatos: Candidato[];
  pagination?: PaginationInfo;
}

export type TipoCatalogo = 'salasRegionales' | 'salaSuperior' | 'tribunalDJ' | 'tribunales' | 'supremacorte';
