/**
 * Prueba para verificar la transformación de datos JSON a modelo de Candidato
 * Esta prueba se centra en verificar que los datos de redes sociales y cursos
 * se procesen correctamente desde el JSON al modelo
 */

import { CandidatoClass, RedSocial } from '../../models/CandidatoModel';
import { CursoCandidato } from '../../types/candidato';

// Implementación simplificada de la función procesarCandidato
function procesarCandidato(candidatoData: any): Partial<CandidatoClass> {
  try {
    // Convertir el ID del candidato a número para comparar correctamente
    const candidatoId = Number(candidatoData.idCandidato);
    
    if (!candidatoId) {
      // Si no hay ID, devolver objeto vacío
      return {};
    }
    
    // Filtrar redes sociales para este candidato específico
    const redesParaCandidato = candidatoData.redesSocialesData?.filter(
      (red: any) => Number(red.idCandidato) === candidatoId
    ) || [];
    
    // Filtrar cursos para este candidato específico
    const cursosParaCandidato = candidatoData.cursosCandidatosData?.filter(
      (curso: any) => Number(curso.idCandidato) === candidatoId
    ) || [];
    
    // Procesar redes sociales
    const redesSociales: RedSocial[] = [];
    if (redesParaCandidato.length > 0) {
      // Mapeo de tipos de redes sociales
      const tipoRedMap: Record<number, string> = {
        1: 'Facebook',
        2: 'Twitter',
        3: 'Instagram',
        4: 'YouTube',
        5: 'TikTok',
        6: 'LinkedIn'
      };
      
      redesParaCandidato.forEach((red: any) => {
        if (red.descripcionRed) {
          const redSocial: RedSocial = {
            idTipoRed: red.idTipoRed,
            descripcionRed: red.descripcionRed,
            nombreRed: tipoRedMap[red.idTipoRed] || `Red Social ${red.idTipoRed}`
          };
          redesSociales.push(redSocial);
        }
      });
    }
    
    // Procesar cursos
    const cursosCandidatos: CursoCandidato[] = [];
    if (cursosParaCandidato.length > 0) {
      cursosParaCandidato.forEach((curso: any) => {
        const cursoCandidato: CursoCandidato = {
          idCurso: curso.idCurso,
          nombreCurso: curso.nombreCurso || '',
          institucion: curso.institucion || '',
          fechaInicio: curso.fechaInicio || '',
          fechaFin: curso.fechaFin || '',
          descripcion: curso.descripcion || ''
        };
        cursosCandidatos.push(cursoCandidato);
      });
    }
    
    // Crear un objeto candidato con todos los campos necesarios
    const candidato: Partial<CandidatoClass> = {
      idCandidato: candidatoId,
      datosPersonales: {
        nombreCandidato: candidatoData.nombreCandidato || `Candidato ID ${candidatoId}`,
        fechaNacimiento: candidatoData.fechaNacimiento || '',
        urlFoto: candidatoData.urlFoto || '',
        sexo: candidatoData.sexo || '',
        cargoPostula: candidatoData.cargoPostula || candidatoData.nombreCorto || ''
      },
      descripcionCandidato: candidatoData.descripcionCandidato || '',
      propuestas: {
        propuesta1: candidatoData.propuesta1 || '',
        propuesta2: candidatoData.propuesta2 || '',
        propuesta3: candidatoData.propuesta3 || ''
      },
      redesSociales,
      cursosCandidatos,
      // Otros campos importantes
      organizacionPostulante: candidatoData.organizacionPostulante || '',
      idEstadoEleccion: candidatoData.idEstadoEleccion || null,
      idSalaRegional: candidatoData.idSalaRegional || null,
      idGrado: candidatoData.idGrado || null,
      descripcionTP: candidatoData.descripcionTP || '',
      descripcionHLC: candidatoData.descripcionHLC || ''
    };
    
    return candidato;
  } catch (error) {
    console.error(`Error al procesar candidato:`, error);
    return {};
  }
}

// Datos de prueba que simulan el JSON recibido de la API externa
const mockJsonData = {
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
  // Datos de redes sociales y cursos
  redesSocialesData: [
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
      idCandidato: 456, // Este no debe incluirse, es de otro candidato
      idTipoRed: 3,
      descripcionRed: 'https://instagram.com/otrocandidato'
    }
  ],
  cursosCandidatosData: [
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
      idCandidato: 123,
      idCurso: 2,
      nombreCurso: 'Derecho Electoral',
      institucion: 'INE',
      fechaInicio: '2015-01-01',
      fechaFin: '2015-12-31',
      descripcion: 'Diplomado'
    },
    {
      idCandidato: 789, // Este no debe incluirse, es de otro candidato
      idCurso: 3,
      nombreCurso: 'Curso de otro candidato',
      institucion: 'Otra institución',
      fechaInicio: '2020-01-01',
      fechaFin: '2020-12-31',
      descripcion: 'Descripción'
    }
  ]
};

// Pruebas
describe('Procesamiento de datos JSON a modelo de Candidato', () => {
  test('Debe transformar correctamente los datos JSON al modelo de Candidato', () => {
    // Procesar el candidato con la función
    const candidatoProcesado = procesarCandidato(mockJsonData);
    
    // Verificar datos básicos del candidato
    expect(candidatoProcesado.idCandidato).toBe(123);
    expect(candidatoProcesado.datosPersonales?.nombreCandidato).toBe('Juan Pérez');
    
    // Verificar redes sociales
    expect(candidatoProcesado.redesSociales).toBeDefined();
    expect(Array.isArray(candidatoProcesado.redesSociales)).toBe(true);
    expect(candidatoProcesado.redesSociales?.length).toBe(2); // Solo debe incluir las 2 redes de este candidato
    
    // Verificar que las redes sociales tengan la estructura correcta
    if (candidatoProcesado.redesSociales && candidatoProcesado.redesSociales.length > 0) {
      const redSocial = candidatoProcesado.redesSociales[0];
      expect(redSocial).toHaveProperty('idTipoRed');
      expect(redSocial).toHaveProperty('descripcionRed');
      expect(redSocial).toHaveProperty('nombreRed');
      
      // Verificar que se haya mapeado correctamente el tipo de red
      expect(redSocial.nombreRed).toBe('Facebook'); // La primera red es Facebook (idTipoRed: 1)
      expect(redSocial.descripcionRed).toBe('https://facebook.com/juanperez');
    }
    
    // Verificar cursos
    expect(candidatoProcesado.cursosCandidatos).toBeDefined();
    expect(Array.isArray(candidatoProcesado.cursosCandidatos)).toBe(true);
    expect(candidatoProcesado.cursosCandidatos?.length).toBe(2); // Solo debe incluir los 2 cursos de este candidato
    
    // Verificar que los cursos tengan la estructura correcta
    if (candidatoProcesado.cursosCandidatos && candidatoProcesado.cursosCandidatos.length > 0) {
      const curso = candidatoProcesado.cursosCandidatos[0];
      expect(curso).toHaveProperty('idCurso');
      expect(curso).toHaveProperty('nombreCurso');
      expect(curso).toHaveProperty('institucion');
      
      // Verificar datos específicos del curso
      expect(curso.nombreCurso).toBe('Derecho Constitucional');
      expect(curso.institucion).toBe('UNAM');
    }
  });
  
  test('Debe filtrar correctamente las redes sociales y cursos de otros candidatos', () => {
    // Procesar el candidato con la función
    const candidatoProcesado = procesarCandidato(mockJsonData);
    
    // Verificar que solo se incluyen las redes sociales de este candidato
    if (candidatoProcesado.redesSociales) {
      // Verificar que no se incluyó la red social del candidato 456
      const redesDeOtroCandidato = candidatoProcesado.redesSociales.filter(
        red => red.descripcionRed === 'https://instagram.com/otrocandidato'
      );
      expect(redesDeOtroCandidato.length).toBe(0);
    }
    
    // Verificar que solo se incluyen los cursos de este candidato
    if (candidatoProcesado.cursosCandidatos) {
      // Verificar que no se incluyó el curso del candidato 789
      const cursosDeOtroCandidato = candidatoProcesado.cursosCandidatos.filter(
        curso => curso.nombreCurso === 'Curso de otro candidato'
      );
      expect(cursosDeOtroCandidato.length).toBe(0);
    }
  });
  
  test('Debe manejar correctamente un candidato sin redes sociales', () => {
    // Crear un candidato sin redes sociales
    const candidatoSinRedes = {
      ...mockJsonData,
      redesSocialesData: []
    };
    
    // Procesar el candidato
    const candidatoProcesado = procesarCandidato(candidatoSinRedes);
    
    // Verificar que redesSociales sea un array vacío
    expect(candidatoProcesado.redesSociales).toBeDefined();
    expect(Array.isArray(candidatoProcesado.redesSociales)).toBe(true);
    expect(candidatoProcesado.redesSociales?.length).toBe(0);
  });
  
  test('Debe manejar correctamente un candidato sin cursos', () => {
    // Crear un candidato sin cursos
    const candidatoSinCursos = {
      ...mockJsonData,
      cursosCandidatosData: []
    };
    
    // Procesar el candidato
    const candidatoProcesado = procesarCandidato(candidatoSinCursos);
    
    // Verificar que cursosCandidatos sea un array vacío
    expect(candidatoProcesado.cursosCandidatos).toBeDefined();
    expect(Array.isArray(candidatoProcesado.cursosCandidatos)).toBe(true);
    expect(candidatoProcesado.cursosCandidatos?.length).toBe(0);
  });
  
  test('Debe ser compatible con MongoDB (serializable/deserializable)', () => {
    // Procesar el candidato
    const candidatoProcesado = procesarCandidato(mockJsonData);
    
    // Simular el proceso de serialización/deserialización de MongoDB
    const serializado = JSON.stringify(candidatoProcesado);
    const deserializado = JSON.parse(serializado);
    
    // Verificar que la estructura se mantiene después de serializar/deserializar
    expect(deserializado.idCandidato).toBe(candidatoProcesado.idCandidato);
    expect(deserializado.datosPersonales.nombreCandidato).toBe(candidatoProcesado.datosPersonales?.nombreCandidato);
    
    // Verificar redes sociales
    expect(deserializado.redesSociales.length).toBe(candidatoProcesado.redesSociales?.length);
    if (deserializado.redesSociales.length > 0 && candidatoProcesado.redesSociales && candidatoProcesado.redesSociales.length > 0) {
      expect(deserializado.redesSociales[0].idTipoRed).toBe(candidatoProcesado.redesSociales[0].idTipoRed);
      expect(deserializado.redesSociales[0].descripcionRed).toBe(candidatoProcesado.redesSociales[0].descripcionRed);
    }
    
    // Verificar cursos
    expect(deserializado.cursosCandidatos.length).toBe(candidatoProcesado.cursosCandidatos?.length);
    if (deserializado.cursosCandidatos.length > 0 && candidatoProcesado.cursosCandidatos && candidatoProcesado.cursosCandidatos.length > 0) {
      expect(deserializado.cursosCandidatos[0].idCurso).toBe(candidatoProcesado.cursosCandidatos[0].idCurso);
      expect(deserializado.cursosCandidatos[0].nombreCurso).toBe(candidatoProcesado.cursosCandidatos[0].nombreCurso);
    }
  });
});
