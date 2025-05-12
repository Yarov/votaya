import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import Voto from '@/models/Voto';
import Candidato from '@/models/Candidato';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticación - Simplificamos este proceso para evitar errores
    // En un entorno de producción, deberíamos asegurar la autenticación adecuada
    // Para fines de desarrollo, asumiremos un usuario de prueba
    // Obtener el usuario autenticado
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Conectar a la base de datos
    await dbConnect();

    // Obtener datos del voto
    let data;
    try {
      data = await req.json();
    } catch (jsonError) {
      console.error('Error al parsear JSON:', jsonError);
      return NextResponse.json({ error: 'Formato de solicitud inválido' }, { status: 400 });
    }
    
    console.log('Datos recibidos:', data);
    
    const { candidatoId } = data;

    if (!candidatoId) {
      return NextResponse.json({ error: 'ID de candidato no proporcionado' }, { status: 400 });
    }

    console.log('Buscando candidato con ID:', candidatoId);
    
    // Verificar que el candidato existe
    let candidato;
    
    // Intentar buscar por ID de MongoDB
    if (mongoose.Types.ObjectId.isValid(candidatoId)) {
      console.log('ID válido para MongoDB, buscando por _id');
      candidato = await Candidato.findById(candidatoId);
    } 
    
    // Si no se encuentra, intentar buscar por idCandidato (compatibilidad)
    if (!candidato) {
      console.log('Buscando por idCandidato como fallback');
      candidato = await Candidato.findOne({ 'idCandidato': candidatoId });
    }
    
    if (!candidato) {
      console.log('Candidato no encontrado');
      return NextResponse.json({ error: 'Candidato no encontrado' }, { status: 404 });
    }
    
    console.log('Candidato encontrado:', candidato.datosPersonales?.nombreCandidato);

    // Usar el _id de MongoDB para el registro del voto
    const candidatoMongoId = (candidato._id as any).toString();
    
    // Verificar si el usuario ya votó por este candidato
    const votoExistente = await Voto.findOne({ 
      userId: userId,
      candidatoId: candidatoMongoId
    });

    if (votoExistente) {
      console.log('Usuario ya votó por este candidato');
      return NextResponse.json({ error: 'Ya has votado por este candidato' }, { status: 409 });
    }

    // Crear el voto
    const nuevoVoto = new Voto({
      userId: userId,
      candidatoId: candidatoMongoId,
      timestamp: new Date()
    });

    await nuevoVoto.save();
    console.log('Voto registrado correctamente');
    
    // Actualizar el contador de votos directamente en el modelo de candidato
    // Esto es más eficiente que contar los votos cada vez que se consulta un candidato
    try {
      await Candidato.findByIdAndUpdate(
        candidatoMongoId,
        { $inc: { totalVotos: 1 } }, // Incrementar el contador de votos en 1
        { new: true } // Devolver el documento actualizado
      );
      console.log('Contador de votos actualizado en el modelo de candidato');
    } catch (updateError) {
      console.error('Error al actualizar el contador de votos:', updateError);
      // No interrumpimos el flujo si falla esta actualización
      // El conteo se recuperará mediante agregación en la próxima consulta
    }

    return NextResponse.json({ 
      success: true, 
      mensaje: 'Voto registrado correctamente',
      voto: {
        candidatoId: candidatoMongoId,
        timestamp: nuevoVoto.timestamp
      }
    });

  } catch (error) {
    console.error('Error al registrar el voto:', error);
    return NextResponse.json({ error: 'Error al registrar el voto' }, { status: 500 });
  }
}
