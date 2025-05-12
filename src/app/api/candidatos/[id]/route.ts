import { NextRequest, NextResponse } from 'next/server';
import { Candidato as CandidatoType, PoderPostulaDescriptivo } from '@/types/candidato';
import mongoose from 'mongoose';
import Candidato from '@/models/Candidato';
import { connectDB, disconnectDB } from '@/lib/mongodb';
import { sanitizeObject, ensureArray, safeString } from '@/utils/dataUtils';
import { VotoModel } from '@/models/VotoModel';
import { DenunciaModel } from '@/models/DenunciaModel';
import { logger } from '@/lib/logger';

/**
 * Enriquece los datos del candidato para asegurar que tenga todos los campos necesarios
 * @param candidato Datos del candidato de MongoDB
 * @returns Candidato con datos enriquecidos
 */
function enriquecerDatosCandidato(candidato: any): CandidatoType {
  // Mapeo de valores numéricos a nombres descriptivos para poderPostula
  const mapearPoderPostula = (poderes: any[]): PoderPostulaDescriptivo[] => {
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
  };

  // Asegurar que datosPersonales exista
  if (!candidato.datosPersonales) {
    candidato.datosPersonales = {
      nombreCandidato: 'Sin nombre'
    };
  }

  // Procesar poderPostula para añadir descripciones
  if (candidato.datosPersonales.poderPostula) {
    const poderes = ensureArray(candidato.datosPersonales.poderPostula);
    candidato.datosPersonales.poderPostulaDescriptivo = mapearPoderPostula(poderes);
  }

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

  // Extraer propuestas de candidaturas si existen
  if (candidato.candidaturas && candidato.candidaturas.length > 0) {
    // Intentar extraer información relevante de las candidaturas
    const candidatura = candidato.candidaturas[0];
    
    if (candidatura) {
      // Si no hay cargoPostula, usar el cargo de la candidatura
      if (!candidato.datosPersonales.cargoPostula && candidatura.cargo) {
        candidato.datosPersonales.cargoPostula = candidatura.cargo;
      }
      
      // Si no hay poderPostula, usar el poder de la candidatura
      if ((!candidato.datosPersonales.poderPostula || candidato.datosPersonales.poderPostula.length === 0) && candidatura.poder) {
        candidato.datosPersonales.poderPostula = [candidatura.poder];
        candidato.datosPersonales.poderPostulaDescriptivo = mapearPoderPostula([candidatura.poder]);
      }
    }
  }

  // Asegurar que datosAcademicos exista
  if (!candidato.datosAcademicos) {
    candidato.datosAcademicos = {};
  }

  // Extraer datos académicos de formacionAcademica si existe
  if (candidato.formacionAcademica && candidato.formacionAcademica.length > 0) {
    const formacion = candidato.formacionAcademica[0];
    
    if (formacion) {
      if (!candidato.datosAcademicos.gradoAcademico && formacion.titulo) {
        candidato.datosAcademicos.gradoAcademico = formacion.titulo;
      }
      
      if (!candidato.datosAcademicos.institucion && formacion.institucion) {
        candidato.datosAcademicos.institucion = formacion.institucion;
      }
      
      if (!candidato.datosAcademicos.anioGraduacion && formacion.anioFin) {
        candidato.datosAcademicos.anioGraduacion = String(formacion.anioFin);
      }
    }
  }

  // Asegurar que contacto sea un objeto con la estructura esperada
  if (Array.isArray(candidato.contacto)) {
    const contactoObj: any = {};
    
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

  // Asegurar que la descripción exista
  if (!candidato.descripcionCandidato) {
    candidato.descripcionCandidato = 
      candidato.datosPersonales.motivacionCargo || 
      candidato.motivacion || 
      candidato.razonPostulacion || 
      'Sin descripción disponible';
  }

  // Sanitizar el objeto para eliminar valores inválidos
  return sanitizeObject(candidato) as CandidatoType;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;


    // Conectar a MongoDB
    await connectDB();
    
    let candidato = null;
    
    // Intentar buscar por ObjectId si es un ID válido de MongoDB
    if (mongoose.Types.ObjectId.isValid(id)) {
      logger.info(`Buscando candidato por ObjectId: ${id}`);
      candidato = await Candidato.findById(id).lean();
    }
    
    // Si no se encontró por ID o no es un ID válido, buscar por nombre
    if (!candidato) {
      logger.info(`Buscando candidato por nombre: ${id}`);
      // Buscar por coincidencia exacta o parcial en el nombre
      const regex = new RegExp(id.replace(/\+/g, ' '), 'i'); // Reemplazar + por espacios para URLs
      candidato = await Candidato.findOne({
        'datosPersonales.nombreCandidato': { $regex: regex }
      }).lean();
    }
    
    if (candidato) {
      // Asegurar que el candidato tenga la estructura esperada
      const candidatoData = candidato as any;

      
      // Convertir el documento de MongoDB al tipo CandidatoType
      const plainDoc = JSON.parse(JSON.stringify(candidato));
      delete plainDoc.__v;
      
      // Obtener el conteo de votos desde la colección de votos
      const candidatoId = candidato._id.toString();
      logger.info(`Counting votes for candidate ${candidatoId}`);
      
      try {
        // Realizar una agregación para contar votos para este candidato
        const votosAgregados = await VotoModel.aggregate([
          { $match: { candidatoId: candidatoId } },
          { $count: "totalVotos" }
        ]);
        
        // Asignar el conteo de votos al candidato
        if (votosAgregados.length > 0) {
          plainDoc.totalVotos = votosAgregados[0].totalVotos;
        } else {
          plainDoc.totalVotos = 0;
        }
        
        logger.info(`Vote count for candidate ${candidatoId}: ${plainDoc.totalVotos}`);
        
        // Contar denuncias para este candidato
        // Convertir el ID a ObjectId y también buscar por string para asegurar compatibilidad
        const denunciasAgregadas = await DenunciaModel.aggregate([
          { 
            $match: { 
              $or: [
                { candidatoId: candidatoId }, // Buscar por string
                { candidatoId: new mongoose.Types.ObjectId(candidatoId) } // Buscar por ObjectId
              ]
            } 
          },
          { $count: "totalDenuncias" }
        ]);
        
        // Log para depuración
        logger.info(`Searching complaints for candidatoId: ${candidatoId}`);
        logger.info(`Query result: ${JSON.stringify(denunciasAgregadas)}`);
        
        
        // Asignar el conteo de denuncias al candidato
        if (denunciasAgregadas.length > 0) {
          plainDoc.totalDenuncias = denunciasAgregadas[0].totalDenuncias;
        } else {
          plainDoc.totalDenuncias = 0;
        }
        
        logger.info(`Complaint count for candidate ${candidatoId}: ${plainDoc.totalDenuncias}`);
      } catch (error) {
        logger.error('Error counting votes or complaints:', error);
        // Si hay un error, usar los valores existentes o 0
        plainDoc.totalVotos = plainDoc.totalVotos || 0;
        plainDoc.totalDenuncias = plainDoc.totalDenuncias || 0;
      }
      
      // Procesar los datos del candidato para asegurar que tenga todos los campos necesarios
      const candidatoEnriquecido = enriquecerDatosCandidato(plainDoc);
      
      return NextResponse.json(candidatoEnriquecido);
    }
    
    // Si llegamos aquí, no se encontró el candidato

    return new NextResponse(JSON.stringify({ error: 'Candidato no encontrado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al buscar candidato:', error);
    return new NextResponse(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
