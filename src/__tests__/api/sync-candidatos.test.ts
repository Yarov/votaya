/**
 * Pruebas de integración para el endpoint de sincronización de candidatos
 * Estas pruebas verifican que el proceso completo de sincronización funcione correctamente,
 * incluyendo el procesamiento de redes sociales y cursos
 */

import mongoose from 'mongoose';
import { CandidatoClass, RedSocial } from '../../../models/CandidatoModel';
import { CursoCandidato } from '../../../types/candidato';

// Mock de fetch para simular la respuesta de la API externa
global.fetch = jest.fn();

// Mock de datos para las pruebas
const mockApiResponse = {
  candidatos: [
    {
      idCandidato: 123,
      nombreCandidato: 'Juan Pérez',
      fechaNacimiento: '1980-01-01',
      urlFoto: 'https://example.com/foto.jpg',
      sexo: 'M',
      nombreCorto: 'Magistrado',
      cargoPostula: 'Magistrado',
      descripcionCandidato: 'Descripción del candidato',
      propuesta1: 'Propuesta 1',
      propuesta2: 'Propuesta 2',
      propuesta3: 'Propuesta 3',
      organizacionPostulante: 'Organización',
      idEstadoEleccion: 9,
      idSalaRegional: 5,
      idGrado: 3,
      descripcionTP: 'Descripción TP',
      descripcionHLC: 'Descripción HLC',
      poderPostula: [1, 2],
      idCircunscripcionEleccion: 2,
      estatusVal: 1
    },
    {
      idCandidato: 456,
      nombreCandidato: 'María Rodríguez',
      fechaNacimiento: '1985-05-15',
      urlFoto: 'https://example.com/foto2.jpg',
      sexo: 'F',
      nombreCorto: 'Magistrada',
      cargoPostula: 'Magistrada',
      descripcionCandidato: 'Descripción de la candidata',
      propuesta1: 'Propuesta 1',
      propuesta2: 'Propuesta 2',
      propuesta3: 'Propuesta 3',
      organizacionPostulante: 'Organización',
      idEstadoEleccion: 5,
      idSalaRegional: 3,
      idGrado: 2,
      descripcionTP: 'Descripción TP',
      descripcionHLC: 'Descripción HLC',
      poderPostula: [1],
      idCircunscripcionEleccion: 1,
      estatusVal: 1
    }
  ],
  redesSociales: [
    {
      idCandidato: 123,
      idTipoRed: 1,
      descripcionRed: 'https://facebook.com/juanperez'
    },
    {
      idCandidato: 123,
      idTipoRed: 2,
      descripcionRed: 'https://twitter.com/juanperez'
    },
    {
      idCandidato: 456,
      idTipoRed: 1,
      descripcionRed: 'https://facebook.com/mariarodriguez'
    }
  ],
  cursosCandidatos: [
    {
      idCandidato: 123,
      idCurso: 1,
      nombreCurso: 'Derecho Constitucional',
      institucion: 'UNAM',
      fechaInicio: '2010-01-01',
      fechaFin: '2010-06-30',
      descripcion: 'Curso de especialización'
    },
    {
      idCandidato: 456,
      idCurso: 2,
      nombreCurso: 'Derecho Electoral',
      institucion: 'INE',
      fechaInicio: '2015-01-01',
      fechaFin: '2015-12-31',
      descripcion: 'Diplomado'
    }
  ]
};

// Mock de la respuesta de MongoDB
const mockMongoResponse = {
  acknowledged: true,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0,
  upsertedId: null
};

describe('API de sincronización de candidatos', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
    
    // Configurar el mock de fetch para devolver la respuesta simulada
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockApiResponse)
    });
    
    // Configurar el mock de mongoose
    mongoose.connect = jest.fn().mockResolvedValue(undefined);
    
    // Mock para el modelo Candidato
    const mockCandidatoModel = {
      find: jest.fn().mockResolvedValue([]),
      bulkWrite: jest.fn().mockResolvedValue(mockMongoResponse),
      insertMany: jest.fn().mockResolvedValue([])
    };
    
    // Asignar el mock al modelo
    (mongoose as any).model = jest.fn().mockReturnValue(mockCandidatoModel);
  });
  
  test('Debe sincronizar correctamente los candidatos con sus redes sociales y cursos', async () => {
    // Crear una solicitud simulada
    const request = new NextRequest('http://localhost:3000/api/admin/sync-candidatos?token=sync-token-123');
    
    // Llamar al endpoint
    const response = await GET(request);
    const responseData = await response.json();
    
    // Verificar que la respuesta sea correcta
    expect(response.status).toBe(200);
    expect(responseData).toHaveProperty('success', true);
    expect(responseData).toHaveProperty('message');
    expect(responseData).toHaveProperty('stats');
    
    // Verificar que se llamó a fetch con la URL correcta
    expect(global.fetch).toHaveBeenCalled();
    
    // Verificar que se llamó a mongoose.connect
    expect(mongoose.connect).toHaveBeenCalled();
    
    // Verificar que se llamó a find para buscar candidatos existentes
    const mockModel = (mongoose as any).model();
    expect(mockModel.find).toHaveBeenCalled();
    
    // Verificar que se llamó a bulkWrite para actualizar candidatos
    expect(mockModel.bulkWrite).toHaveBeenCalled();
  });
  
  test('Debe rechazar la sincronización si el token es inválido', async () => {
    // Crear una solicitud con token inválido
    const request = new NextRequest('http://localhost:3000/api/admin/sync-candidatos?token=invalid-token');
    
    // Llamar al endpoint
    const response = await GET(request);
    const responseData = await response.json();
    
    // Verificar que la respuesta sea un error de autenticación
    expect(response.status).toBe(401);
    expect(responseData).toHaveProperty('success', false);
    expect(responseData).toHaveProperty('message');
    
    // Verificar que no se llamó a fetch
    expect(global.fetch).not.toHaveBeenCalled();
    
    // Verificar que no se llamó a mongoose.connect
    expect(mongoose.connect).not.toHaveBeenCalled();
  });
  
  test('Debe manejar correctamente errores en la API externa', async () => {
    // Configurar fetch para simular un error
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });
    
    // Crear una solicitud simulada
    const request = new NextRequest('http://localhost:3000/api/admin/sync-candidatos?token=sync-token-123');
    
    // Llamar al endpoint
    const response = await GET(request);
    const responseData = await response.json();
    
    // Verificar que la respuesta indique un error
    expect(response.status).toBe(500);
    expect(responseData).toHaveProperty('success', false);
    expect(responseData).toHaveProperty('message');
    
    // Verificar que se llamó a fetch
    expect(global.fetch).toHaveBeenCalled();
    
    // Verificar que no se intentó guardar en la base de datos
    const mockModel = (mongoose as any).model();
    expect(mockModel.bulkWrite).not.toHaveBeenCalled();
  });
});

// Prueba específica para verificar el procesamiento de redes sociales y cursos
describe('Procesamiento de redes sociales y cursos', () => {
  // Mock para simular el modelo CandidatoModel
  const mockCandidatoModel = {
    find: jest.fn().mockImplementation(async (query) => {
      // Simular un candidato existente
      if (query.idCandidato && query.idCandidato.$in && query.idCandidato.$in.includes(123)) {
        return [{
          _id: 'existing_id_123',
          idCandidato: 123,
          datosPersonales: {
            nombreCandidato: 'Juan Pérez Existente'
          },
          // Sin redes sociales ni cursos inicialmente
          redesSociales: [],
          cursosCandidatos: []
        }];
      }
      return [];
    }),
    bulkWrite: jest.fn().mockImplementation(async (operations) => {
      // Verificar que las operaciones incluyen redesSociales y cursosCandidatos
      const updateOps = operations.filter((op: any) => op.updateOne);
      
      // Verificar si alguna operación de actualización incluye redesSociales
      const hasRedesSociales = updateOps.some((op: any) => 
        op.updateOne.update.$set && op.updateOne.update.$set.redesSociales
      );
      
      // Verificar si alguna operación de actualización incluye cursosCandidatos
      const hasCursosCandidatos = updateOps.some((op: any) => 
        op.updateOne.update.$set && op.updateOne.update.$set.cursosCandidatos
      );
      
      return { 
        matchedCount: updateOps.length,
        modifiedCount: updateOps.length,
        hasRedesSociales,
        hasCursosCandidatos
      };
    }),
    insertMany: jest.fn().mockResolvedValue([])
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configurar el mock de fetch
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockApiResponse)
    });
    
    // Configurar mongoose
    mongoose.connect = jest.fn().mockResolvedValue(undefined);
    (mongoose as any).model = jest.fn().mockReturnValue(mockCandidatoModel);
  });
  
  test('Debe procesar correctamente las redes sociales y cursos al sincronizar', async () => {
    // Crear una solicitud simulada
    const request = new NextRequest('http://localhost:3000/api/admin/sync-candidatos?token=sync-token-123');
    
    // Llamar al endpoint
    const response = await GET(request);
    
    // Verificar que la respuesta sea correcta
    expect(response.status).toBe(200);
    
    // Obtener las operaciones de bulkWrite
    const bulkWriteCall = mockCandidatoModel.bulkWrite.mock.calls[0][0];
    
    // Verificar que se procesaron las redes sociales y cursos
    const bulkWriteResult = await mockCandidatoModel.bulkWrite(bulkWriteCall);
    expect(bulkWriteResult.hasRedesSociales).toBe(true);
    expect(bulkWriteResult.hasCursosCandidatos).toBe(true);
  });
});
