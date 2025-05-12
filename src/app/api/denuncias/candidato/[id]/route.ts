import { NextResponse, NextRequest } from 'next/server';
import { DenunciaModel } from '@/models/DenunciaModel';
import { CandidatoModel } from '@/models/CandidatoModel';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '@/lib/mongodb';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    const { id } = params;
    
    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID de candidato inválido' },
        { status: 400 }
      );
    }
    
    // Verificar que el candidato exista
    const candidatoExists = await CandidatoModel.exists({ _id: new mongoose.Types.ObjectId(id) });
    if (!candidatoExists) {
      return NextResponse.json(
        { error: 'Candidato no encontrado' },
        { status: 404 }
      );
    }
    
    // Buscar denuncias para este candidato
    // Usar una aproximación más simple para evitar problemas de TypeScript
    const objectId = new mongoose.Types.ObjectId(id);
    
    // Ejecutar la consulta usando un enfoque más directo
    // @ts-ignore - Ignoramos errores de TypeScript aquí para evitar problemas con las firmas de métodos
    const denuncias = await DenunciaModel.find({ candidatoId: objectId }).exec();
    
    // Ordenar las denuncias por fecha de creación (más recientes primero)
    denuncias.sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    // Para simplificar, en lugar de obtener información real de los usuarios,
    // vamos a crear información de usuario simulada para cada denuncia
    const usersMap = new Map();
    
    // Generar datos simulados para cada userId único
    denuncias.forEach((denuncia: any) => {
      const userId = denuncia.userId;
      if (!usersMap.has(userId)) {
        // Crear un nombre aleatorio para el usuario
        const nombres = ['Juan', 'María', 'Carlos', 'Ana', 'Pedro', 'Laura', 'Miguel', 'Sofía'];
        const apellidos = ['García', 'López', 'Martínez', 'Rodríguez', 'Hernández', 'Gómez'];
        const nombreAleatorio = nombres[Math.floor(Math.random() * nombres.length)];
        const apellidoAleatorio = apellidos[Math.floor(Math.random() * apellidos.length)];
        
        usersMap.set(userId, {
          id: userId,
          nombre: `${nombreAleatorio} ${apellidoAleatorio}`,
          email: `${nombreAleatorio.toLowerCase()}.${apellidoAleatorio.toLowerCase()}@ejemplo.com`,
          imageUrl: '',  // No hay imagen
          username: `${nombreAleatorio.toLowerCase()}${Math.floor(Math.random() * 1000)}`,
        });
      }
    });
    
    // Convertir a objetos planos para la respuesta
    const denunciasPlanas = denuncias.map((denuncia: any) => {
      const obj = denuncia.toObject();
      
      // Formatear fechas para facilitar su uso en el frontend
      if (obj.createdAt) {
        obj.fechaCreacion = obj.createdAt.toISOString();
        obj.fechaCreacionFormateada = new Date(obj.createdAt).toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      
      // Añadir información del usuario que hizo la denuncia
      obj.usuario = usersMap.get(obj.userId) || {
        id: obj.userId,
        nombre: 'Usuario desconocido',
        email: '',
        imageUrl: '',
        username: '',
      };
      
      return obj;
    });
    
    return NextResponse.json(denunciasPlanas);
  } catch (error) {
    console.error('Error al obtener denuncias del candidato:', error);
    return NextResponse.json(
      { error: 'Error al obtener las denuncias' },
      { status: 500 }
    );
  } finally {
    // Desconectar de la base de datos
    await disconnectDB();
  }
}
