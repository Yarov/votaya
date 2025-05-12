import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Voto from '@/models/Voto';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Obtener los parámetros de la URL
    const { searchParams } = new URL(req.url);
    const candidatoId = searchParams.get('candidatoId');
    
    let query = {};
    
    // Si se proporciona un ID de candidato específico, filtrar por ese ID
    if (candidatoId) {
      query = { candidatoId };
    }
    
    // Realizar una agregación para contar votos por candidato
    const votosAgregados = await Voto.aggregate([
      { $match: query },
      { $group: { _id: "$candidatoId", total: { $sum: 1 } } }
    ]);
    
    // Transformar el resultado en un objeto más fácil de usar
    const conteoVotos = votosAgregados.reduce((acc: Record<string, number>, item) => {
      acc[item._id] = item.total;
      return acc;
    }, {});
    
    return NextResponse.json({ 
      success: true,
      votos: conteoVotos
    });
    
  } catch (error) {
    console.error('Error al obtener conteo de votos:', error);
    return NextResponse.json({ 
      error: 'Error al obtener conteo de votos' 
    }, { status: 500 });
  }
}
