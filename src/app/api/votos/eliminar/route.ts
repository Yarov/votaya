import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import Voto from '@/models/Voto';
import mongoose from 'mongoose';

export async function DELETE(request: NextRequest) {
  try {
    // Verificar autenticación
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    // Conectar a la base de datos
    await dbConnect();
    
    // Obtener el ID del voto a eliminar
    const { searchParams } = new URL(request.url);
    const votoId = searchParams.get('votoId');
    
    if (!votoId || !mongoose.Types.ObjectId.isValid(votoId)) {
      return NextResponse.json(
        { error: 'ID de voto inválido o no proporcionado' },
        { status: 400 }
      );
    }
    
    // Buscar el voto y verificar que pertenezca al usuario
    const voto = await Voto.findById(votoId);
    
    if (!voto) {
      return NextResponse.json(
        { error: 'Voto no encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar que el voto pertenezca al usuario autenticado
    if (voto.userId !== userId) {
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar este voto' },
        { status: 403 }
      );
    }
    
    // Eliminar el voto
    await Voto.findByIdAndDelete(votoId);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Voto eliminado correctamente' 
    });
    
  } catch (error) {
    console.error('Error al eliminar voto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
