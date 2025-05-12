import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import Voto from '@/models/Voto';
import Candidato from '@/models/Candidato';
import mongoose from 'mongoose';

interface CandidatoDoc {
  _id: mongoose.Types.ObjectId;
  idCandidato?: string;
  [key: string]: any;
}

interface VotoDoc {
  _id: mongoose.Types.ObjectId;
  userId: string;
  candidatoId: string;
  timestamp?: Date;
  [key: string]: any;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const candidatoId = searchParams.get('candidatoId');
    
    // Verificar que se proporcionó el ID del candidato
    if (!candidatoId) {
      return NextResponse.json(
        { error: 'Se requiere candidatoId' },
        { status: 400 }
      );
    }

    // Obtener el ID del usuario autenticado
    let userId;
    
    try {
      // Intentar obtener el usuario autenticado
      const auth = getAuth(request);
      userId = auth.userId;
      
      if (!userId) {
        return NextResponse.json(
          { error: 'Usuario no autenticado', hasVoted: false },
          { status: 401 }
        );
      }
    } catch (error) {
      // En modo de desarrollo, permitimos consultas sin autenticación para pruebas
      if (process.env.NODE_ENV === 'development') {

        userId = searchParams.get('userId') || 'test_user_id';
      } else {
        // En producción, devolver error de autenticación
        console.error('Error de autenticación:', error);
        return NextResponse.json(
          { error: 'Error de autenticación', hasVoted: false },
          { status: 401 }
        );
      }
    }

    // Conectar a la base de datos
    await dbConnect();
    
    // Buscar el candidato para obtener su ID de MongoDB
    let candidatoMongoId = candidatoId;
    
    // Si el ID no es un ObjectId válido, intentar buscar por idCandidato
    if (!mongoose.Types.ObjectId.isValid(candidatoId)) {
      const candidato = await Candidato.findOne({ idCandidato: candidatoId }).lean() as CandidatoDoc | null;
      if (candidato && candidato._id) {
        candidatoMongoId = candidato._id.toString();
      }
    }
    
    // Buscar si existe un voto del usuario para este candidato
    const voto = await Voto.findOne({ 
      userId, 
      candidatoId: candidatoMongoId 
    }).lean() as VotoDoc | null;
    
    // Devolver si el usuario ha votado o no
    return NextResponse.json({ 
      hasVoted: !!voto,
      candidatoId: candidatoMongoId,
      timestamp: voto && voto.timestamp ? voto.timestamp : null
    });
  } catch (error) {
    console.error('Error al verificar estado de voto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
