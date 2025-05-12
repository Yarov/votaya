import { CandidatoClass, DatosPersonales, PoderPostulaDescriptivo, Propuestas, DatosContacto, DatosAcademicos } from '@/models/CandidatoModel';
import { sanitizeObject, ensureArray, safeString } from './dataUtils';

// Catálogo de grados académicos
const CATALOGO_GRADOS_ACADEMICOS = [
  { estatus: "Cédula profesional", idGrado: 1, descripcionGrado: "Postdoctorado" },
  { estatus: "Título profesional", idGrado: 2, descripcionGrado: "Postdoctorado" },
  { estatus: "Concluido", idGrado: 3, descripcionGrado: "Postdoctorado" },
  { estatus: "Cédula profesional", idGrado: 5, descripcionGrado: "Doctorado" },
  { estatus: "Título profesional", idGrado: 6, descripcionGrado: "Doctorado" },
  { estatus: "Concluido", idGrado: 7, descripcionGrado: "Doctorado" },
  { estatus: "Cédula profesional", idGrado: 9, descripcionGrado: "Maestría" },
  { estatus: "Título profesional", idGrado: 10, descripcionGrado: "Maestría" },
  { estatus: "Concluido", idGrado: 11, descripcionGrado: "Maestría" },
  { estatus: "Cédula profesional", idGrado: 13, descripcionGrado: "Especialidad" },
  { estatus: "Título profesional", idGrado: 14, descripcionGrado: "Especialidad" },
  { estatus: "Concluido", idGrado: 15, descripcionGrado: "Especialidad" },
  { estatus: "Cédula profesional", idGrado: 17, descripcionGrado: "Licenciatura" },
  { estatus: "Título profesional", idGrado: 18, descripcionGrado: "Licenciatura" },
  { estatus: "Concluido", idGrado: 19, descripcionGrado: "Licenciatura" }
];

// Catálogo de tipos de candidatura
const CATALOGO_TIPOS_CANDIDATURA = [
  { idTipoCandidatura: 6, nombreCombo: "Ministra/o Suprema Corte de Justicia de la Nación", nombreCorto: "Ministra/o Suprema Corte de Justicia de la Nación" },
  { idTipoCandidatura: 7, nombreCombo: "Magistratura Tribunal de Disciplina Judicial", nombreCorto: "Magistratura Tribunal de Disciplina Judicial" },
  { idTipoCandidatura: 8, nombreCombo: "Magistratura Sala Superior del Tribunal Electoral del Poder Judicial de la Federación", nombreCorto: "Magistratura Sala Superior del TE del PJF" },
  { idTipoCandidatura: 9, nombreCombo: "Magistratura Salas Regionales del Tribunal Electoral del Poder Judicial de la Federación", nombreCorto: "Magistratura Salas Regionales del TE del PJF" },
  { idTipoCandidatura: 10, nombreCombo: "Magistraturas de Tribunales Colegiados de Circuito y Colegiados de Apelación", nombreCorto: "Magistraturas de Tribunales Colegiados de Circuito" },
  { idTipoCandidatura: 11, nombreCombo: "Juezas/es de Distrito", nombreCorto: "Juezas/es de Distrito" }
];

/**
 * Obtiene la descripción del grado académico a partir de su ID
 * @param idGrado ID del grado académico
 * @returns Descripción del grado académico o string vacío si no se encuentra
 */
export function obtenerDescripcionGradoAcademico(idGrado: number): string {
  const grado = CATALOGO_GRADOS_ACADEMICOS.find(g => g.idGrado === idGrado);
  return grado ? grado.descripcionGrado : '';
}

/**
 * Obtiene el estatus del grado académico a partir de su ID
 * @param idGrado ID del grado académico
 * @returns Estatus del grado académico o string vacío si no se encuentra
 */
export function obtenerEstatusGradoAcademico(idGrado: number): string {
  const grado = CATALOGO_GRADOS_ACADEMICOS.find(g => g.idGrado === idGrado);
  return grado ? grado.estatus : '';
}

/**
 * Obtiene la información completa del tipo de candidatura a partir de su ID
 * @param idTipoCandidatura ID del tipo de candidatura
 * @returns Objeto con la información del tipo de candidatura o null si no se encuentra
 */
export function obtenerTipoCandidatura(idTipoCandidatura: number) {
  return CATALOGO_TIPOS_CANDIDATURA.find(tc => tc.idTipoCandidatura === idTipoCandidatura) || null;
}

/**
 * Obtiene el nombre corto del tipo de candidatura a partir de su ID
 * @param idTipoCandidatura ID del tipo de candidatura
 * @returns Nombre corto del tipo de candidatura o string vacío si no se encuentra
 */
export function obtenerNombreCortoCandidatura(idTipoCandidatura: number): string {
  const tipoCandidatura = obtenerTipoCandidatura(idTipoCandidatura);
  return tipoCandidatura ? tipoCandidatura.nombreCorto : '';
}

/**
 * Mapea los valores numéricos de poderPostula a nombres descriptivos
 * @param poderes Array de poderes (numéricos o string)
 * @returns Array de objetos con código y descripción
 */
export function mapearPoderPostula(poderes: any[]): PoderPostulaDescriptivo[] {
  const poderMap: Record<string, string> = {
    '1': 'Salas Regionales',
    '2': 'Sala Superior',
    '3': 'Tribunal de Disciplina Judicial',
    '4': 'Tribunales',
    '5': 'Suprema Corte'
  };
  
  return poderes.map(poder => {
    const codigo = String(poder);
    const descripcion = poderMap[codigo] || codigo;
    return { codigo, descripcion };
  });
}

/**
 * Transforma los datos crudos de un candidato al formato estructurado usando Typegoose
 * @param data Datos crudos del candidato
 * @returns Candidato transformado
 */
export function transformarCandidato(data: any): Partial<CandidatoClass> {
  if (!data) {
    throw new Error('Datos de candidato inválidos');
  }
  
  // Construir datos personales
  const datosPersonales: Partial<DatosPersonales> = {
    nombreCandidato: safeString(data.nombreCandidato, ''),
    fechaNacimiento: safeString(data.fechaNacimiento, ''),
    urlFoto: safeString(data.urlFoto, ''),
    sexo: data.sexo || '',
    numListaBoleta: safeString(data.numListaBoleta, ''),
    poderPostula: ensureArray(data.poderPostula),
    cargoPostula: data.cargoPostula || ''
  };
  
  // Obtener el cargo a partir del ID de tipo de candidatura si está disponible
  if (data.idTipoCandidatura) {
    const nombreCandidatura = obtenerNombreCortoCandidatura(Number(data.idTipoCandidatura));
    if (nombreCandidatura) {
      datosPersonales.cargoPostula = nombreCandidatura;
    }
  }
  
  // Procesar poderPostula para añadir descripciones
  if (datosPersonales.poderPostula && datosPersonales.poderPostula.length > 0) {
    datosPersonales.poderPostulaDescriptivo = mapearPoderPostula(datosPersonales.poderPostula);
  }
  
  // Construir propuestas
  const propuestas: Partial<Propuestas> = {};
  
  // Extraer propuestas de los campos directos si existen
  if (data.propuesta1) {
    propuestas.propuesta1 = data.propuesta1;
  }
  
  if (data.propuesta2) {
    propuestas.propuesta2 = data.propuesta2;
  }
  
  if (data.propuesta3) {
    propuestas.propuesta3 = data.propuesta3;
  }
  
  // Si hay un objeto de propuestas, usar esos valores
  if (data.propuestas) {
    if (data.propuestas.propuesta1) propuestas.propuesta1 = data.propuestas.propuesta1;
    if (data.propuestas.propuesta2) propuestas.propuesta2 = data.propuestas.propuesta2;
    if (data.propuestas.propuesta3) propuestas.propuesta3 = data.propuestas.propuesta3;
  }
  
  // Construir datos de contacto
  const contacto: Partial<DatosContacto> = {
    correoElecPublico: safeString(data.correoElecPublico, ''),
    telefonoPublico: safeString(data.telefonoPublico, ''),
    paginaWeb: safeString(data.paginaWeb, '')
  };
  
  // Procesar contacto si es un objeto
  if (data.contacto && typeof data.contacto === 'object' && !Array.isArray(data.contacto)) {
    if (data.contacto.correoElecPublico) contacto.correoElecPublico = data.contacto.correoElecPublico;
    if (data.contacto.telefonoPublico) contacto.telefonoPublico = data.contacto.telefonoPublico;
    if (data.contacto.paginaWeb) contacto.paginaWeb = data.contacto.paginaWeb;
  }
  
  // Construir datos académicos
  const datosAcademicos: Partial<DatosAcademicos> = {
    gradoAcademico: '',
    institucion: safeString(data.institucion, ''),
    anioGraduacion: safeString(data.anioGraduacion, ''),
    especialidad: safeString(data.especialidad, ''),
    descripcion: safeString(data.descripcionAcademica || data.descripcionTP, ''),
    trayectoria: [],
    certificaciones: []
  };
  
  // Obtener el grado académico a partir del ID si está disponible
  if (data.idGrado) {
    datosAcademicos.gradoAcademico = obtenerDescripcionGradoAcademico(Number(data.idGrado));
  }
  
  // Construir el candidato final
  const candidato: Partial<CandidatoClass> = {
    _id: data._id,
    idCandidato: data.idCandidato,
    datosPersonales: datosPersonales as DatosPersonales, // Cast necesario para satisfacer el tipo
    descripcionCandidato: safeString(data.descripcionCandidato, ''),
    propuestas: propuestas as Propuestas, // Cast necesario para satisfacer el tipo
    propuesta1: propuestas.propuesta1,
    propuesta2: propuestas.propuesta2,
    propuesta3: propuestas.propuesta3,
    visionImparticionJusticia: safeString(data.visionImparticionJusticia, ''),
    contacto: [], // El hook pre-save convertirá el objeto contacto a array
    datosAcademicos: datosAcademicos as DatosAcademicos, // Cast necesario para satisfacer el tipo
    razonPostulacion: safeString(data.razonPostulacion, ''),
    organizacionPostulante: safeString(data.organizacionPostulante, ''),
    // Campos adicionales que podrían estar presentes
    tipoCandidato: data.tipoCandidato,
    idCircunscripcionEleccion: data.idCircunscripcionEleccion,
    idEstadoEleccion: data.idEstadoEleccion,
    idSalaRegional: data.idSalaRegional,
    idGrado: data.idGrado,
    idTipoCandidatura: data.idTipoCandidatura,
    descripcionTP: data.descripcionTP,
    descripcionHLC: data.descripcionHLC
  };
  
  // Asignar el objeto contacto para que el hook pre-save lo convierta a array
  (candidato as any).contacto = contacto;
  
  return sanitizeObject(candidato) as Partial<CandidatoClass>;
}

/**
 * Prepara los datos del candidato para enviarlos a la API
 * @param candidato Datos del candidato a preparar
 * @returns Datos preparados para la API
 */
export function prepararDatosParaAPI(candidato: Partial<CandidatoClass>): any {
  const datos: any = { ...candidato };
  
  // Extraer propuestas a campos directos si es necesario
  if (datos.propuestas) {
    if (datos.propuestas.propuesta1) {
      datos.propuesta1 = datos.propuestas.propuesta1;
    }
    
    if (datos.propuestas.propuesta2) {
      datos.propuesta2 = datos.propuestas.propuesta2;
    }
    
    if (datos.propuestas.propuesta3) {
      datos.propuesta3 = datos.propuestas.propuesta3;
    }
  }
  
  // Convertir poderPostulaDescriptivo a poderPostula si es necesario
  if (datos.datosPersonales && datos.datosPersonales.poderPostulaDescriptivo && !datos.datosPersonales.poderPostula) {
    datos.datosPersonales.poderPostula = datos.datosPersonales.poderPostulaDescriptivo.map((poder: PoderPostulaDescriptivo) => poder.codigo);
  }
  
  // Extraer idGrado de datosAcademicos si existe
  if (datos.datosAcademicos && datos.datosAcademicos.gradoAcademico && !datos.idGrado) {
    // Buscar el idGrado correspondiente al gradoAcademico
    const grado = CATALOGO_GRADOS_ACADEMICOS.find(g => 
      g.descripcionGrado.toLowerCase() === datos.datosAcademicos.gradoAcademico.toLowerCase()
    );
    
    if (grado) {
      datos.idGrado = grado.idGrado;
    }
  }
  
  // Extraer idTipoCandidatura de datosPersonales.cargoPostula si existe
  if (datos.datosPersonales && datos.datosPersonales.cargoPostula && !datos.idTipoCandidatura) {
    // Buscar el idTipoCandidatura correspondiente al cargoPostula
    const tipoCandidatura = CATALOGO_TIPOS_CANDIDATURA.find(tc => 
      tc.nombreCorto.toLowerCase() === datos.datosPersonales.cargoPostula.toLowerCase() ||
      tc.nombreCombo.toLowerCase() === datos.datosPersonales.cargoPostula.toLowerCase()
    );
    
    if (tipoCandidatura) {
      datos.idTipoCandidatura = tipoCandidatura.idTipoCandidatura;
    }
  }
  
  return sanitizeObject(datos);
}
