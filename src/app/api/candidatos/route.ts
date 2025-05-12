import { NextResponse } from 'next/server';
import { CatalogoResponse, TipoCatalogo, Candidato as CandidatoType } from '@/types/candidato';
import mongoose from 'mongoose';
import CandidatoModel from '@/models/CandidatoModel';
import dbConnect from '@/lib/mongodb';
import { VotoModel } from '@/models/VotoModel';

/**
 * Función para obtener candidatos de MongoDB filtrados por tipo y entidad federativa
 * con soporte para paginación
 */
async function getCandidatosFromMongoDB(tipo: TipoCatalogo | null, entidadId?: string, page: number = 1, limit: number = 12) {
  // Conectar a MongoDB
  await dbConnect();
  
  // Construir consulta base
  const query: any = {};
  
  // Si se especifica una entidad federativa, agregar al filtro
  if (entidadId && /^\d{1,2}$/.test(entidadId)) {
    // Convertir a número si es posible
    const entidadIdNum = parseInt(entidadId, 10);
    query.idEstadoEleccion = entidadIdNum;
    console.log(`Filtrando por entidad federativa ID: ${entidadIdNum}`);
  }
  
  // Si se especifica un tipo, construir un filtro adecuado
  if (tipo) {
    // Mapeo de tipos a criterios de filtrado para la consulta
    switch (tipo) {
      case 'salasRegionales':
        query.$or = [
          { 'datosPersonales.cargoPostula': { $regex: /Sala Regional/i } },
          { 'datosPersonales.poderPostula': { $in: [1, '1'] } }
        ];
        break;
      case 'salaSuperior':
        query.$or = [
          { 'datosPersonales.cargoPostula': { $regex: /Sala Superior/i } },
          { 'datosPersonales.poderPostula': { $in: [2, '2'] } }
        ];
        break;
      case 'tribunalDJ':
        query.$or = [
          { 'datosPersonales.cargoPostula': { $regex: /Tribunal de Disciplina/i } },
          { 'datosPersonales.poderPostula': { $in: [3, '3'] } }
        ];
        break;
      case 'tribunales':
        query.$or = [
          { 'datosPersonales.cargoPostula': { $regex: /Tribunal/i } },
          { 'datosPersonales.poderPostula': { $in: [4, '4'] } }
        ];
        break;
      case 'supremacorte':
        query.$or = [
          { 'datosPersonales.cargoPostula': { $regex: /Suprema Corte/i } },
          { 'datosPersonales.poderPostula': { $in: [5, '5'] } }
        ];
        break;
    }
  }
  
  // Calcular el total de candidatos que coinciden con la consulta (para paginación)
  const totalCandidatos = await CandidatoModel.countDocuments(query);
  
  // Calcular skip para paginación
  const skip = (page - 1) * limit;
  
  // Importar el modelo de Voto para la agregación
  // Primero, obtener los candidatos con la consulta básica
  const candidatos = await CandidatoModel.find(query)
    .skip(skip)
    .limit(limit)
    .lean();
    
  // Obtener los IDs de los candidatos para la consulta de conteo de votos
  const candidatoIds = candidatos.map(c => c._id.toString());
  
  // Realizar una agregación para contar votos por candidato
  const votosAgregados = await VotoModel.aggregate([
    { $match: { candidatoId: { $in: candidatoIds } } },
    { $group: { _id: "$candidatoId", totalVotos: { $sum: 1 } } }
  ]);
  
  // Crear un mapa de ID de candidato a conteo de votos para acceso rápido
  const votosPorCandidato = new Map();
  votosAgregados.forEach(item => {
    votosPorCandidato.set(item._id, item.totalVotos);
  });
  
  // Asignar el conteo de votos a cada candidato
  candidatos.forEach(candidato => {
    const candidatoId = candidato._id.toString();
    candidato.totalVotos = votosPorCandidato.get(candidatoId) || 0;
  });
  
  console.log(`Paginación: página ${page}, límite ${limit}, total ${totalCandidatos}`);
  console.log(`Candidatos obtenidos para esta página: ${candidatos.length}`);
  
  return {
    candidatos,
    pagination: {
      total: totalCandidatos,
      page,
      limit,
      totalPages: Math.ceil(totalCandidatos / limit)
    }
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo') as TipoCatalogo | null;
    const entidadId = searchParams.get('entidad');
    
    // Obtener parámetros de paginación
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    
    console.log(`Buscando candidatos en MongoDB con tipo: ${tipo || 'todos'}${entidadId ? ` y entidad: ${entidadId}` : ''}, página: ${page}, límite: ${limit}`);
    
    // Obtener candidatos de MongoDB con la consulta optimizada y paginación
    const result = await getCandidatosFromMongoDB(tipo, entidadId || undefined, page, limit);
    
    // Convertir los documentos de MongoDB al tipo CandidatoType
    // y aplicar las transformaciones necesarias
    const candidatos = result.candidatos.map((doc: any) => {
      // Convertir el documento a un objeto plano
      const plainDoc = JSON.parse(JSON.stringify(doc));
      
      // Eliminar campos internos de MongoDB que no necesitamos exponer
      delete plainDoc.__v;
      
      // Asegurarse de que las propuestas estén correctamente estructuradas
      if (!plainDoc.propuestas) {
        plainDoc.propuestas = {};
      }
      
      // Si hay propuestas directas pero no están en el objeto propuestas, copiarlas
      if (plainDoc.propuesta1 && !plainDoc.propuestas.propuesta1) {
        plainDoc.propuestas.propuesta1 = plainDoc.propuesta1;
      }
      if (plainDoc.propuesta2 && !plainDoc.propuestas.propuesta2) {
        plainDoc.propuestas.propuesta2 = plainDoc.propuesta2;
      }
      if (plainDoc.propuesta3 && !plainDoc.propuestas.propuesta3) {
        plainDoc.propuestas.propuesta3 = plainDoc.propuesta3;
      }
      
      // Asegurarse de que totalVotos esté definido y sea un número
      if (plainDoc.totalVotos === undefined || plainDoc.totalVotos === null) {
        plainDoc.totalVotos = 0;
      } else {
        // Convertir a número si es una cadena
        plainDoc.totalVotos = Number(plainDoc.totalVotos);
      }
      
      return plainDoc as CandidatoType;
    });
    
    console.log(`Total de candidatos obtenidos para esta página: ${candidatos.length}`);

    // Creamos la respuesta con información de paginación
    const transformedData: CatalogoResponse = {
      fecha: new Date().toISOString(),
      candidatos: candidatos,
      pagination: result.pagination
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error al obtener candidatos de MongoDB:', error);
    return NextResponse.json(
      { error: 'Error al obtener los datos de MongoDB', message: (error as Error).message },
      { status: 500 }
    );
  }
}
