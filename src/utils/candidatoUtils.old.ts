import { Candidato, DatosPersonales, DatosContacto, DatosAcademicos, Propuestas, PoderPostulaDescriptivo } from '@/types/candidato';
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
 * Procesa los datos de contacto del candidato
 * @param data Datos crudos del candidato
 * @returns Objeto de contacto estructurado
 */
export function procesarContacto(data: any): DatosContacto {
  const contacto: DatosContacto = {
    correoElecPublico: safeString(data.correoElecPublico, ''),
    telefonoPublico: safeString(data.telefonoPublico, ''),
    paginaWeb: safeString(data.paginaWeb, '')
  };
  
  // Procesar contacto si es un objeto
  if (data.contacto && typeof data.contacto === 'object' && !Array.isArray(data.contacto)) {
    Object.assign(contacto, data.contacto);
  } 
  // Procesar contacto si es un array
  else if (Array.isArray(data.contacto)) {
    data.contacto.forEach((item: any) => {
      if (item.tipo && item.valor) {
        if (item.tipo === 'email' || item.tipo === 'correo') {
          contacto.correoElecPublico = item.valor;
        } else if (item.tipo === 'telefono') {
          contacto.telefonoPublico = item.valor;
        } else if (item.tipo === 'web' || item.tipo === 'pagina') {
          contacto.paginaWeb = item.valor;
        }
      }
    });
  }
  
  return contacto;
}

/**
 * Extrae y procesa los datos académicos del candidato
 * @param data Datos crudos del candidato
 * @returns Objeto de datos académicos estructurado
 */
export function extraerDatosAcademicos(data: any): DatosAcademicos {
  const datosAcademicos: DatosAcademicos = {
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
  
  // Procesar formación académica si existe como array
  if (Array.isArray(data.formacionAcademica) && data.formacionAcademica.length > 0) {
    // Si no tenemos grado académico aún, intentar obtenerlo del primer elemento
    if (!datosAcademicos.gradoAcademico && data.formacionAcademica[0].idGrado) {
      datosAcademicos.gradoAcademico = obtenerDescripcionGradoAcademico(Number(data.formacionAcademica[0].idGrado));
    }
    
    // Si no tenemos institución, intentar obtenerla del primer elemento
    if (!datosAcademicos.institucion && data.formacionAcademica[0].institucion) {
      datosAcademicos.institucion = data.formacionAcademica[0].institucion;
    }
    
    // Extraer trayectoria de la formación académica
    datosAcademicos.trayectoria = data.formacionAcademica
      .filter((item: any) => item && item.descripcion)
      .map((item: any) => item.descripcion);
  }
  
  // Procesar certificaciones si existen
  if (Array.isArray(data.certificaciones)) {
    datosAcademicos.certificaciones = data.certificaciones
      .filter((cert: any) => cert && typeof cert === 'string')
      .map((cert: string) => cert.trim());
  }
  
  return datosAcademicos;
}

/**
 * Extrae y procesa las propuestas del candidato
 * @param data Datos crudos del candidato
 * @returns Objeto de propuestas estructurado
 */
export function extraerPropuestas(data: any): Propuestas {
  const propuestas: Propuestas = {};
  
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
    Object.assign(propuestas, data.propuestas);
  }
  
  return propuestas;
}

/**
 * Construye el objeto de datos personales del candidato
 * @param data Datos crudos del candidato
 * @returns Objeto de datos personales estructurado
 */
export function construirDatosPersonales(data: any): DatosPersonales {
  const datosPersonales: DatosPersonales = {
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
  
  return datosPersonales;
}

/**
 * Transforma los datos crudos de un candidato al formato estructurado
 * @param data Datos crudos del candidato
 * @returns Candidato transformado
 */
export function transformarCandidato(data: any): Candidato {
  if (!data) {
    throw new Error('Datos de candidato inválidos');
  }
  
  // Construir el candidato final
  const candidato: Candidato = {
    _id: data._id,
    idCandidato: data.idCandidato,
    datosPersonales: construirDatosPersonales(data),
    descripcionCandidato: safeString(data.descripcionCandidato, ''),
    propuestas: extraerPropuestas(data),
    visionImparticionJusticia: safeString(data.visionImparticionJusticia, ''),
    contacto: procesarContacto(data),
    datosAcademicos: extraerDatosAcademicos(data),
    razonPostulacion: safeString(data.razonPostulacion, ''),
    organizacionPostulante: safeString(data.organizacionPostulante, ''),
    // Campos adicionales que podrían estar presentes
    tipoCandidato: data.tipoCandidato,
    idCircunscripcionEleccion: data.idCircunscripcionEleccion,
    idEstadoEleccion: data.idEstadoEleccion,
    idSalaRegional: data.idSalaRegional,
    idGrado: data.idGrado
  };
  
  return sanitizeObject(candidato) as Candidato;
}

/**
 * Función para enriquecer los datos de un candidato
 * Asegura que todos los campos necesarios estén presentes y con el formato correcto
 * @param candidato Datos del candidato a enriquecer
 * @returns Candidato con datos enriquecidos
 */
export function enriquecerDatosCandidato(candidato: any): Candidato {
  // Asegurar que propuestas exista
  if (!candidato.propuestas) {
    candidato.propuestas = {};
  }
  
  // Extraer propuestas de los campos directos si existen
  if (candidato.propuesta1) {
    candidato.propuestas.propuesta1 = candidato.propuesta1;
  }
  
  if (candidato.propuesta2) {
    candidato.propuestas.propuesta2 = candidato.propuesta2;
  }
  
  if (candidato.propuesta3) {
    candidato.propuestas.propuesta3 = candidato.propuesta3;
  }
  
  // Procesar poderPostula para añadir descripciones si es necesario
  if (candidato.datosPersonales && candidato.datosPersonales.poderPostula && !candidato.datosPersonales.poderPostulaDescriptivo) {
    candidato.datosPersonales.poderPostulaDescriptivo = mapearPoderPostula(candidato.datosPersonales.poderPostula);
  }
  
  // Procesar contacto si es un array
  if (Array.isArray(candidato.contacto)) {
    const contactoObj: DatosContacto = {
      correoElecPublico: '',
      telefonoPublico: '',
      paginaWeb: ''
    };
    
    candidato.contacto.forEach((item: any) => {
      if (item.tipo && item.valor) {
        if (item.tipo === 'email' || item.tipo === 'correo') {
          contactoObj.correoElecPublico = item.valor;
        } else if (item.tipo === 'telefono') {
          contactoObj.telefonoPublico = item.valor;
        } else if (item.tipo === 'web' || item.tipo === 'pagina') {
          contactoObj.paginaWeb = item.valor;
        }
      }
    });
    
    candidato.contacto = contactoObj;
  }
  
  // Asegurar que datosAcademicos exista
  if (!candidato.datosAcademicos) {
    candidato.datosAcademicos = {};
  }
  
  // Obtener el grado académico a partir del ID si está disponible
  if (candidato.idGrado && !candidato.datosAcademicos.gradoAcademico) {
    candidato.datosAcademicos.gradoAcademico = obtenerDescripcionGradoAcademico(Number(candidato.idGrado));
  }
  
  // Obtener el cargo a partir del ID de tipo de candidatura si está disponible
  if (candidato.idTipoCandidatura && candidato.datosPersonales && !candidato.datosPersonales.cargoPostula) {
    const nombreCandidatura = obtenerNombreCortoCandidatura(Number(candidato.idTipoCandidatura));
    if (nombreCandidatura) {
      candidato.datosPersonales.cargoPostula = nombreCandidatura;
    }
  }
  
  return candidato as Candidato;
}

/**
 * Prepara los datos del candidato para enviarlos a la API
 * @param candidato Datos del candidato a preparar
 * @returns Datos preparados para la API
 */
export function prepararDatosParaAPI(candidato: Candidato): any {
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
