import { promises as fs } from 'fs';
import path from 'path';
import { Candidato, CatalogoResponse } from '@/types/candidato';

// Ruta donde se guardan los datos
const DATA_DIR = path.join(process.cwd(), 'data');
const CANDIDATOS_FILE = path.join(DATA_DIR, 'candidatos.json');

/**
 * Lee todos los candidatos del archivo JSON
 */
export async function readCandidatos(): Promise<Candidato[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    try {
      const data = await fs.readFile(CANDIDATOS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe, devolver un array vacío
      console.warn('No se encontró el archivo de candidatos, devolviendo array vacío');
      return [];
    }
  } catch (error) {
    console.error('Error al leer candidatos del archivo:', error);
    return [];
  }
}

/**
 * Busca un candidato por su nombre
 */
export async function findCandidatoByName(name: string): Promise<Candidato | null> {
  const candidatos = await readCandidatos();
  
  // Buscar por nombre (insensible a mayúsculas/minúsculas)
  const regex = new RegExp(name, 'i');
  return candidatos.find(c => 
    c.datosPersonales && 
    c.datosPersonales.nombreCandidato && 
    regex.test(c.datosPersonales.nombreCandidato)
  ) || null;
}

/**
 * Filtra candidatos por tipo
 */
export async function filterCandidatosByType(tipo: string | null): Promise<Candidato[]> {
  const candidatos = await readCandidatos();
  
  if (!tipo) {
    return candidatos;
  }
  
  // Filtrar según el tipo
  return candidatos.filter(c => {
    if (!c.candidaturas || !c.candidaturas.length) {
      return false;
    }
    
    // Mapeo de tipos a patrones de búsqueda
    const patterns: Record<string, RegExp> = {
      'salasRegionales': /Sala Regional/i,
      'salaSuperior': /Sala Superior/i,
      'tribunalDJ': /Tribunal de Disciplina/i,
      'tribunales': /Tribunal/i,
      'supremacorte': /Suprema Corte/i
    };
    
    const pattern = patterns[tipo];
    if (!pattern) {
      return false;
    }
    
    // Verificar si alguna candidatura coincide con el patrón
    return c.candidaturas.some(candidatura => 
      candidatura.cargo && pattern.test(candidatura.cargo)
    );
  });
}
