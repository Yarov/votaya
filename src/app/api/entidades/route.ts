import { NextResponse } from 'next/server';
import { ENTIDADES_FEDERATIVAS } from '@/utils/entidadesFederativas';

/**
 * API endpoint para obtener la lista de entidades federativas
 */
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      entidades: ENTIDADES_FEDERATIVAS
    });
  } catch (error) {
    console.error('Error al obtener entidades federativas:', error);
    return NextResponse.json(
      { error: 'Error al obtener entidades federativas', message: (error as Error).message },
      { status: 500 }
    );
  }
}
