import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import Voto from '@/models/Voto';
import Candidato from '@/models/Candidato';
import mongoose from 'mongoose';

interface VotoConCandidato {
  _id: string;
  candidatoId: string;
  timestamp: Date;
  candidato: {
    _id: string;
    idCandidato?: string;
    datosPersonales?: {
      nombreCandidato?: string;
      apellidoPaterno?: string;
      apellidoMaterno?: string;
      urlFoto?: string;
      poderPostula?: string[];
      cargoPostula?: string;
      numListaBoleta?: string;
    };
    cargo?: string;
    partido?: string;
  } | null;
}

export async function GET(request: NextRequest) {
  try {
    // Obtener el ID del usuario autenticado
    // Obtener el usuario autenticado
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Usuario no autenticado', votos: [] },
        { status: 401 }
      );
    }

    // Conectar a la base de datos
    await dbConnect();
    
    // Buscar todos los votos del usuario
    const votos = await Voto.find({ userId }).sort({ timestamp: -1 }).lean();
    
    if (!votos || votos.length === 0) {
      return NextResponse.json({ votos: [] });
    }
    
    // Obtener los detalles de los candidatos votados
    const votosConCandidatos = await Promise.all(
      votos.map(async (voto: any) => {
        let candidato = null;
        
        if (voto.candidatoId && mongoose.Types.ObjectId.isValid(voto.candidatoId)) {
          const candidatoDoc: any = await Candidato.findById(voto.candidatoId).select({
            _id: 1,
            idCandidato: 1,
            datosPersonales: 1,
            cargo: 1,
            partido: 1
          }).lean();
          
          if (candidatoDoc && candidatoDoc._id) {
            candidato = {
              _id: candidatoDoc._id.toString(),
              idCandidato: candidatoDoc.idCandidato || undefined,
              datosPersonales: {
                nombreCandidato: candidatoDoc.datosPersonales?.nombreCandidato,
                apellidoPaterno: candidatoDoc.datosPersonales?.apellidoPaterno,
                apellidoMaterno: candidatoDoc.datosPersonales?.apellidoMaterno,
                urlFoto: candidatoDoc.datosPersonales?.urlFoto,
                poderPostula: candidatoDoc.datosPersonales?.poderPostula,
                cargoPostula: candidatoDoc.datosPersonales?.cargoPostula,
                numListaBoleta: candidatoDoc.datosPersonales?.numListaBoleta
              },
              cargo: candidatoDoc.cargo || undefined,
              partido: candidatoDoc.partido || undefined
            };
          }
        }
        
        return {
          _id: voto._id.toString(),
          candidatoId: voto.candidatoId,
          timestamp: voto.timestamp,
          candidato
        };
      })
    );
    
    // Asegurarse de que los datos cumplen con la interfaz VotoConCandidato
    const votosFormateados: VotoConCandidato[] = votosConCandidatos;
    
    return NextResponse.json({ votos: votosFormateados });
  } catch (error) {
    console.error('Error al obtener votos del usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
