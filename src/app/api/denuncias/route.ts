import { NextResponse, NextRequest } from 'next/server';
import { DenunciaModel, Denuncia } from '@/models/DenunciaModel';
import { CandidatoModel, Candidato } from '@/models/CandidatoModel';
import { getAuth } from '@clerk/nextjs/server';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    const { titulo, descripcion, candidatoId } = await request.json();
    
    // Validar que el usuario esté autenticado usando el request
    const auth = getAuth(request);
    const { userId } = auth;
    if (!userId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Validar que el candidato exista usando el modelo directamente
    const candidato = await CandidatoModel.findOne({ _id: new mongoose.Types.ObjectId(candidatoId) }) as Candidato & mongoose.Document;
    if (!candidato) {
      return NextResponse.json(
        { error: 'Candidato no encontrado' },
        { status: 404 }
      );
    }

    // Crear la denuncia
    const denunciaData = {
      titulo,
      descripcion,
      candidatoId,
      userId,
      estado: 'PENDIENTE',
      resuelto: false
    };

    const denuncia = new DenunciaModel(denunciaData) as Denuncia & mongoose.Document;

    await denuncia.save();

    return NextResponse.json({
      success: true,
      message: 'Denuncia creada exitosamente'
    });
  } catch (error) {
    console.error('Error al crear denuncia:', error);
    return NextResponse.json(
      { error: 'Error al crear la denuncia' },
      { status: 500 }
    );
  }
}

// Obtener todas las denuncias
export async function GET() {
  try {
    // Usar el modelo de Mongoose directamente para evitar problemas de tipado con Typegoose
    const denuncias = await (DenunciaModel as any).find({}).lean();
    
    // Ya no es necesario convertir a objetos planos porque lean() ya lo hace

    return NextResponse.json(denuncias);
  } catch (error) {
    console.error('Error al obtener denuncias:', error);
    return NextResponse.json(
      { error: 'Error al obtener las denuncias' },
      { status: 500 }
    );
  }
}
