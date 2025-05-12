import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import CandidatoModel, { Candidato, DatosPersonales, Contacto, PoderPostulaDescriptivo, RedSocial } from '@/models/CandidatoModel';

// Token simple para proteger el endpoint (en producción usar algo más seguro)
const SYNC_TOKEN = process.env.SYNC_TOKEN || 'sync-token-123';

// Usar la variable de entorno MONGODB_URI del archivo .env
const MONGODB_URI = process.env.MONGODB_URI || '';

// Verificar que la variable de entorno esté definida
if (!MONGODB_URI) {
  console.warn('La variable de entorno MONGODB_URI no está definida. No se podrá conectar a MongoDB Atlas.');
}

/**
 * Función para conectar a MongoDB Atlas
 */
async function connectToMongoDB() {
  try {
    // Si ya está conectado, devolver la conexión existente
    if (mongoose.connection.readyState >= 1) {
      return mongoose.connection;
    }
    

    
    // Configuración de conexión actualizada para MongoDB 4.x+
    const options: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
    };
    
    // Intentar conectar usando la variable de entorno MONGODB_URI
    const conn = await mongoose.connect(MONGODB_URI, options);

    return conn;
  } catch (error) {
    console.error('Error al conectar a MongoDB Atlas:', error);
    throw error;
  }
}

/**
 * Procesa un candidato para adaptarlo al modelo de Typegoose
 */
function procesarCandidato(candidatoData: any): Partial<Candidato> {
  try {
    // Verificar datos mínimos
    if (!candidatoData || !candidatoData.idCandidato) {
      console.error('Candidato inválido o sin ID');
      // Devolver un objeto vacío en lugar de null para evitar errores de tipo
      return {} as Partial<Candidato>;
    }
    
    // Mapeo de poder postula a descriptivo
    const poderPostulaDescriptivo: PoderPostulaDescriptivo[] = [];
    if (candidatoData.poderPostula && Array.isArray(candidatoData.poderPostula)) {
      const poderMap: Record<string, string> = {
        '1': 'Salas Regionales',
        '2': 'Sala Superior',
        '3': 'Tribunal de Disciplina Judicial',
        '4': 'Tribunales',
        '5': 'Suprema Corte'
      };
      
      candidatoData.poderPostula.forEach((poder: any) => {
        const codigo = String(poder);
        const descripcion = poderMap[codigo] || codigo;
        poderPostulaDescriptivo.push({ codigo, descripcion });
      });
    }
    
    // Crear objeto de datos personales
    const datosPersonales: Partial<DatosPersonales> = {
      nombreCandidato: candidatoData.nombreCandidato || `Candidato ID ${candidatoData.idCandidato}`,
      fechaNacimiento: candidatoData.fechaNacimiento || '',
      urlFoto: candidatoData.urlFoto || '',
      sexo: candidatoData.sexo || '',
      numListaBoleta: candidatoData.numListaBoleta || '',
      poderPostula: candidatoData.poderPostula || [],
      poderPostulaDescriptivo,
      cargoPostula: candidatoData.cargoPostula || candidatoData.nombreCorto || ''
    };
    
    // Crear array de contactos
    const contacto: Contacto[] = [];
    if (candidatoData.correoElecPublico) {
      contacto.push({ tipo: 'email', valor: candidatoData.correoElecPublico });
    }
    
    if (candidatoData.telefonoPublico) {
      contacto.push({ tipo: 'telefono', valor: candidatoData.telefonoPublico });
    }
    
    if (candidatoData.paginaWeb) {
      contacto.push({ tipo: 'web', valor: candidatoData.paginaWeb });
    }
    
    // Si no hay contactos, agregar uno por defecto
    if (contacto.length === 0) {
      contacto.push({ tipo: 'no_especificado', valor: 'no_disponible' });
    }
    
    // Procesar redes sociales si existen en el JSON fuente
    const redesSociales: RedSocial[] = [];
    if (candidatoData.redesSocialesData && Array.isArray(candidatoData.redesSocialesData)) {
      // Mapeo de tipos de redes sociales
      const tipoRedMap: Record<number, string> = {
        1: 'Facebook',
        2: 'Twitter',
        3: 'Instagram',
        4: 'YouTube',
        5: 'TikTok',
        6: 'LinkedIn'
      };
      
      // Convertir el ID del candidato a número para comparar correctamente
      const candidatoId = Number(candidatoData.idCandidato);
      
      // Verificar si hay redes sociales para este candidato específico
      const redesParaCandidato = candidatoData.redesSocialesData.filter(
        (red: any) => Number(red.idCandidato) === candidatoId
      );
      

      
      redesParaCandidato.forEach((red: any) => {
        if (red.descripcionRed) {
          const redSocial: RedSocial = {
            idTipoRed: red.idTipoRed,
            descripcionRed: red.descripcionRed,
            nombreRed: tipoRedMap[red.idTipoRed] || `Red Social ${red.idTipoRed}`
          };
          redesSociales.push(redSocial);

        }
      });
    }
    
    // Procesar cursos si existen en el JSON fuente
    const cursosCandidatos: any[] = [];
    if (candidatoData.cursosCandidatosData && Array.isArray(candidatoData.cursosCandidatosData)) {
      // Usar el mismo candidatoId convertido a número
      const candidatoId = Number(candidatoData.idCandidato);
      
      // Filtrar cursos para este candidato específico
      const cursosParaCandidato = candidatoData.cursosCandidatosData.filter(
        (curso: any) => Number(curso.idCandidato) === candidatoId
      );
      

      
      cursosParaCandidato.forEach((curso: any) => {
        const cursoCandidato = {
          idCurso: curso.idCurso,
          nombreCurso: curso.nombreCurso || '',
          institucion: curso.institucion || '',
          fechaInicio: curso.fechaInicio || '',
          fechaFin: curso.fechaFin || '',
          descripcion: curso.descripcion || ''
        };
        cursosCandidatos.push(cursoCandidato);

      });
    }
    
    // Crear objeto candidato completo
    const candidato: Partial<Candidato> = {
      idCandidato: candidatoData.idCandidato,
      datosPersonales: datosPersonales as DatosPersonales,
      descripcionCandidato: candidatoData.descripcionCandidato || '',
      propuestas: {
        propuesta1: candidatoData.propuesta1 || '',
        propuesta2: candidatoData.propuesta2 || '',
        propuesta3: candidatoData.propuesta3 || ''
      },
      // Mantener propuestas como campos directos para compatibilidad
      propuesta1: candidatoData.propuesta1 || '',
      propuesta2: candidatoData.propuesta2 || '',
      propuesta3: candidatoData.propuesta3 || '',
      visionImparticionJusticia: candidatoData.visionImparticionJusticia || candidatoData.visionJurisdiccional || '',
      contacto,
      datosAcademicos: {
        gradoAcademico: '',  // Se rellenará con el catálogo
        descripcion: candidatoData.descripcionTP || '',
        institucion: candidatoData.institucion || '',
        anioGraduacion: candidatoData.anioGraduacion || '',
        especialidad: candidatoData.especialidad || '',
        trayectoria: [],
        certificaciones: []
      },
      razonPostulacion: candidatoData.razonPostulacion || '',
      // Almacenamos algunos datos adicionales como propiedades personalizadas que no están en el modelo
      // pero que pueden ser útiles para la aplicación
      motivacion: candidatoData.visionImparticionJusticia || candidatoData.razonPostulacion || '',
      // Agregar los nuevos campos
      redesSociales,
      cursosCandidatos
    };
    
    return candidato;
  } catch (error) {
    console.error(`Error al procesar candidato:`, error);
    // Devolver un objeto vacío en lugar de null para evitar errores de tipo
    return {} as Partial<Candidato>;
  }
}

/**
 * Obtiene los datos de candidatos de una URL externa
 */
async function fetchCandidatosFromUrl(url: string) {
  try {

    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Error al obtener candidatos: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Verificar que la respuesta tenga la estructura esperada
    if (!data || !data.candidatos || !Array.isArray(data.candidatos)) {
      console.error('Respuesta con formato inesperado:', data);
      return [];
    }
    

    
    // Extraer las redes sociales y cursos para procesarlos junto con los candidatos
    const redesSociales = data.redesSociales || [];
    const cursosCandidatos = data.cursosCandidatos || [];
    

    
    // Procesar cada candidato para adaptarlo al modelo
    const candidatosProcesados = data.candidatos.map((candidato: any) => {
      // Crear una copia del candidato con las redes sociales y cursos asociados
      const candidatoConDatos = {
        ...candidato,
        // Agregar las redes sociales y cursos como propiedades del candidato para procesamiento
        redesSocialesData: redesSociales,
        cursosCandidatosData: cursosCandidatos
      };
      
      return procesarCandidato(candidatoConDatos);
    }).filter(Boolean); // Filtrar candidatos nulos
    

    
    return candidatosProcesados;
  } catch (error) {
    console.error(`Error al obtener candidatos de ${url}:`, error);
    return [];
  }
}

/**
 * Guarda los candidatos en MongoDB usando operaciones por lotes para mayor eficiencia
 */
async function saveCandidatosToMongoDB(candidatos: Partial<Candidato>[]) {
  try {
    // Conectar a MongoDB Atlas
    await connectToMongoDB();
    
    // Contadores para estadísticas
    let created = 0;
    let updated = 0;
    let errors = 0;
    
    // Si no hay candidatos, devolver estadísticas vacías
    if (!candidatos || candidatos.length === 0) {
      return { created, updated, errors };
    }
    

    
    // Obtener todos los IDs de candidatos para buscarlos de una sola vez
    const candidatoIds = candidatos.map(c => c.idCandidato);
    
    // Buscar todos los candidatos existentes en una sola consulta
    const existingCandidatos = await CandidatoModel.find({ 
      idCandidato: { $in: candidatoIds } 
    }).lean();
    
    // Crear un mapa de IDs a documentos existentes para acceso rápido
    const existingMap = new Map();
    existingCandidatos.forEach(doc => {
      existingMap.set(doc.idCandidato, doc);
    });
    
    // Preparar operaciones por lotes
    const bulkOps = [];
    const newCandidatos = [];
    
    // Clasificar candidatos para actualización o creación
    for (const candidato of candidatos) {
      try {
        if (existingMap.has(candidato.idCandidato)) {
          // Preparar actualización
          const existingDoc = existingMap.get(candidato.idCandidato);
          
          // Verificar si el candidato tiene redes sociales o cursos
          const hasRedesSociales = candidato.redesSociales && candidato.redesSociales.length > 0;
          const hasCursosCandidatos = candidato.cursosCandidatos && candidato.cursosCandidatos.length > 0;
          
          // Crear un objeto de actualización que solo actualice los campos que existen
          const updateObj: any = {};
          
          // Copiar todos los campos del candidato excepto redesSociales y cursosCandidatos
          Object.keys(candidato).forEach(key => {
            if (key !== 'redesSociales' && key !== 'cursosCandidatos') {
              // Usar una aserción de tipo para evitar errores de tipo
              updateObj[key] = (candidato as any)[key];
            }
          });
          
          // Solo incluir redesSociales si existen
          if (hasRedesSociales && candidato.redesSociales) {
            updateObj.redesSociales = candidato.redesSociales;

          }
          
          // Solo incluir cursosCandidatos si existen
          if (hasCursosCandidatos && candidato.cursosCandidatos) {
            updateObj.cursosCandidatos = candidato.cursosCandidatos;

          }
          
          bulkOps.push({
            updateOne: {
              filter: { _id: existingDoc._id },
              update: { $set: updateObj },
              upsert: false
            }
          });
          updated++;
        } else {
          // Agregar a la lista de nuevos candidatos
          newCandidatos.push(candidato);
          created++;
        }
      } catch (error) {
        console.error(`Error al procesar candidato ID ${candidato.idCandidato}:`, error);
        errors++;
      }
    }
    
    // Ejecutar operaciones por lotes para actualizaciones
    if (bulkOps.length > 0) {

      const bulkResult = await CandidatoModel.bulkWrite(bulkOps, { ordered: false });
    }
    
    // Crear nuevos candidatos en lotes
    if (newCandidatos.length > 0) {

      await CandidatoModel.insertMany(newCandidatos, { ordered: false });
    }
    

    return { created, updated, errors };
  } catch (error) {
    console.error('Error general al guardar candidatos:', error);
    return { created: 0, updated: 0, errors: candidatos.length };
  }
}

// URLs de las APIs externas
const CATALOGOS_URLS = {
  salasRegionales: 'https://candidaturaspoderjudicial.ine.mx/cycc/documentos/json/magistraturaSalasRegionales.json',
  salaSuperior: 'https://candidaturaspoderjudicial.ine.mx/cycc/documentos/json/magistraturaSalaSuperior.json',
  tribunalDJ: 'https://candidaturaspoderjudicial.ine.mx/cycc/documentos/json/magistraturaTribunalDJ.json',
  tribunales: 'https://candidaturaspoderjudicial.ine.mx/cycc/documentos/json/magistraturaTribunales.json',
  supremacorte: 'https://candidaturaspoderjudicial.ine.mx/cycc/documentos/json/ministrosSupremaCorte.json'
};

// Lista de todas las URLs
const TODAS_URLS = Object.values(CATALOGOS_URLS);

/**
 * API endpoint para sincronizar candidatos
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar token de acceso
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!token || token !== SYNC_TOKEN) {
      return NextResponse.json({ error: 'No autorizado. Token inválido o faltante.' }, { status: 401 });
    }

    // Obtener todos los candidatos de todas las fuentes
    const allCandidatos = [];
    
    for (const url of TODAS_URLS) {
      const candidatos = await fetchCandidatosFromUrl(url);
      allCandidatos.push(...candidatos);
    }



    // Estadísticas
    let mongoStats = { created: 0, updated: 0, errors: 0 };
    
    // Guardar en MongoDB Atlas
    try {
      mongoStats = await saveCandidatosToMongoDB(allCandidatos);
    } catch (mongoError) {
      console.error('Error al guardar en MongoDB Atlas:', mongoError);
      mongoStats.errors = allCandidatos.length;
      
      return NextResponse.json({
        success: false,
        error: 'Error al guardar en MongoDB Atlas',
        message: (mongoError as Error).message
      }, { status: 500 });
    }

    // Devolver estadísticas
    return NextResponse.json({
      success: true,
      stats: {
        total: allCandidatos.length,
        mongodb: mongoStats
      }
    });

  } catch (error) {
    console.error('Error general en la sincronización:', error);
    return NextResponse.json({ 
      error: 'Error en la sincronización',
      message: (error as Error).message 
    }, { status: 500 });
  }
}
