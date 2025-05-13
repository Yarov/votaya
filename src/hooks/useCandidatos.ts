import { useState, useEffect } from 'react';
import { Candidato, TipoCatalogo } from '@/types/candidato';
import { useUserVotos } from './useUserVotos';

interface UseCandidatosReturn {
  allCandidatos: Candidato[];
  displayedCandidatos: Candidato[];
  loading: boolean;
  error: string;
  currentPage: number;
  totalPages: number;
  totalCandidatos: number;
  tipoCatalogo: TipoCatalogo | '';
  searchQuery: string;
  entidadId: string;
  fetchCandidatos: () => Promise<void>;
  handlePageChange: (page: number) => void;
  handleVotar: (candidato: Candidato, userId: string | null | undefined) => Promise<{ success: boolean; message?: string }>;
  handleDenunciar: (candidato: Candidato, userId: string | null | undefined) => Promise<{ success: boolean; message?: string }>;
  setTipoCatalogo: (tipo: TipoCatalogo) => void;
  setSearchQuery: (query: string) => void;
  setEntidadId: (entidad: string) => void;
}

// Cache para almacenar datos de candidatos por ID
const candidatosCache: Record<string, { data: Candidato; timestamp: number }> = {};

// Tiempo de expiración del caché en milisegundos (5 minutos)
const CACHE_EXPIRATION = 5 * 60 * 1000;

// Función para obtener un candidato del caché o null si no existe o expiró
function getCachedCandidato(id: string): Candidato | null {
  const cached = candidatosCache[id];
  if (!cached) return null;
  
  // Verificar si el caché ha expirado
  if (Date.now() - cached.timestamp > CACHE_EXPIRATION) {
    delete candidatosCache[id];
    return null;
  }
  
  return cached.data;
}

// Función para guardar un candidato en el caché
function cacheCandidato(candidato: Candidato): void {
  const id = candidato._id || candidato.idCandidato as string;
  if (!id) return;
  
  candidatosCache[id] = {
    data: candidato,
    timestamp: Date.now()
  };
}

export function useCandidatos(): UseCandidatosReturn {
  const [allCandidatos, setAllCandidatos] = useState<Candidato[]>([]);
  const [displayedCandidatos, setDisplayedCandidatos] = useState<Candidato[]>([]);
  const [tipoCatalogo, setTipoCatalogo] = useState<TipoCatalogo | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState("");
  const [entidadId, setEntidadId] = useState("");
  const { hasVoted } = useUserVotos();

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCandidatos, setTotalCandidatos] = useState(0);
  const candidatosPorPagina = 30;

  // Efecto para cargar candidatos cuando cambian los filtros, la página o la búsqueda
  useEffect(() => {
    fetchCandidatos();
  }, [tipoCatalogo, entidadId, currentPage, searchQuery]);

  // Efecto para reiniciar a la primera página cuando cambia la búsqueda, tipo o entidad
  useEffect(() => {
    if (searchQuery.trim() !== "" || tipoCatalogo || entidadId) {
      setCurrentPage(1); // Reiniciar a la primera página al cambiar filtros
    }
  }, [searchQuery, tipoCatalogo, entidadId]);

  // Efecto para actualizar los candidatos mostrados con el estado de voto
  useEffect(() => {
    // Marcar userHasVoted para cada candidato
    const candidatosMarcados = allCandidatos.map((c) => ({
      ...c,
      userHasVoted: hasVoted(c._id || c.idCandidato as string),
    }));

    setDisplayedCandidatos(candidatosMarcados);
  }, [allCandidatos, hasVoted]);

  const fetchCandidatos = async () => {
    setLoading(true);
    setError('');
    try {
      // Construir la URL con los parámetros de filtrado y paginación
      let url = `/api/candidatos?page=${currentPage}&limit=${candidatosPorPagina}`;
      
      // Solo incluir el tipo si no hay texto de búsqueda
      if (tipoCatalogo && searchQuery.trim() === "") {
        url += `&tipo=${tipoCatalogo}`;
      }
      
      // Incluir entidad si está seleccionada
      if (entidadId) {
        url += `&entidad=${entidadId}`;
      }
      
      // Incluir término de búsqueda si existe
      if (searchQuery.trim() !== "") {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }

      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'VotoCiudadano/1.0'
        }
      });

      if (!response.ok) {
        throw new Error('No se pudieron cargar los candidatos');
      }

      const data = await response.json();

      // Verificar si hay candidatos en la respuesta
      if (!data.candidatos || !Array.isArray(data.candidatos)) {
        console.error('La respuesta no contiene un array de candidatos:', data);
        throw new Error('Formato de respuesta inválido');
      }

      // Asegurarse de que todos los candidatos tengan un valor válido para totalVotos
      // y aplicar caché para información personal
      const candidatosConVotosValidos = data.candidatos.map((c: Candidato) => {
        const id = c._id || c.idCandidato as string;
        const cachedCandidato = getCachedCandidato(id);
        
        // Crear candidato con datos actualizados pero preservando información personal en caché
        const candidatoActualizado = {
          ...c,
          userHasVoted: hasVoted(id),
          // Asegurar que totalVotos siempre sea un número
          totalVotos: typeof c.totalVotos === 'number' ? c.totalVotos : 0
        };
        
        // Si hay datos en caché, usar la información personal de la caché
        if (cachedCandidato) {
          // Mantener los datos personales en caché pero actualizar datos dinámicos
          candidatoActualizado.datosPersonales = cachedCandidato.datosPersonales;
          candidatoActualizado.descripcionCandidato = cachedCandidato.descripcionCandidato;
          candidatoActualizado.propuestas = cachedCandidato.propuestas;
        }
        
        // Guardar en caché
        cacheCandidato(candidatoActualizado);
        
        return candidatoActualizado;
      });



      // Actualizar el estado con los candidatos recibidos
      // Si es la primera página o hay búsqueda, reemplazar allCandidatos
      // Si no, mantener los candidatos existentes para búsquedas locales
      if (currentPage === 1 || searchQuery.trim() !== "") {
        setAllCandidatos(candidatosConVotosValidos);
      } else {
        // Solo actualizamos allCandidatos si hay nuevos candidatos que no teníamos antes
        const newCandidatoIds = new Set(candidatosConVotosValidos.map((c: Candidato) => c._id || c.idCandidato));
        const existingIds = new Set(allCandidatos.map((c: Candidato) => c._id || c.idCandidato));
        // Convertir a array y verificar si hay nuevos candidatos
        const hasNewCandidatos = Array.from(newCandidatoIds).some(id => id !== undefined && id !== null && !existingIds.has(id as string | number));

        if (hasNewCandidatos) {
          // Combinar los candidatos existentes con los nuevos, evitando duplicados
          const combinedCandidatos = [...allCandidatos];
          candidatosConVotosValidos.forEach((newCandidato: Candidato) => {
            const id = newCandidato._id || newCandidato.idCandidato;
            if (id && !existingIds.has(id)) {
              combinedCandidatos.push(newCandidato);
            }
          });
          setAllCandidatos(combinedCandidatos);
        }
      }

      // Actualizar los candidatos mostrados con los datos procesados
      setDisplayedCandidatos(candidatosConVotosValidos);

      // Actualizar la información de paginación
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages);
        setTotalCandidatos(data.pagination.total);
      } else {
        // Fallback si no hay información de paginación
        setTotalPages(Math.ceil(candidatosConVotosValidos.length / candidatosPorPagina) || 1);
        setTotalCandidatos(candidatosConVotosValidos.length);
      }
    } catch (error) {
      console.error('Error al obtener candidatos:', error);
      setError('No se pudieron cargar los candidatos. Intenta nuevamente.');
      setAllCandidatos([]);
      setDisplayedCandidatos([]);
      setTotalPages(1);
      setTotalCandidatos(0);
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar de página
  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      // La carga de datos se maneja en el efecto que observa currentPage
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVotar = async (candidato: Candidato, userId: string | null | undefined) => {
    if (!userId) {
      return { success: false, message: 'Usuario no autenticado' };
    }

    // Si el candidato ya tiene userHasVoted=true, no intentar votar de nuevo
    if (candidato.userHasVoted) {

      return { success: false, message: 'Ya has votado por este candidato' };
    }

    setLoading(true);
    try {
      const candidatoId = candidato._id || candidato.idCandidato;
      const tipoCat = 'candidatos';

      const response = await fetch('/api/votar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          candidatoId,
          tipoCatalogo: tipoCat
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          return { success: false, message: 'Usuario no autenticado' };
        }
        const errorData = await response.json();

        // Si el error es porque ya votó, actualizar la UI para reflejar esto
        if (errorData.error && errorData.error.includes('Ya has votado')) {
          // Actualizar inmediatamente la UI para mostrar que el usuario ya ha votado
          updateCandidatoVoteStatus(candidato);
          return { success: false, message: 'Ya has votado por este candidato' };
        }

        throw new Error(errorData.error || 'Error al registrar voto');
      }

      // Actualizar la UI inmediatamente para mostrar que el voto fue exitoso
      updateCandidatoVoteStatus(candidato);

      return { success: true, message: 'Voto registrado correctamente' };
    } catch (error) {
      console.error('Error al votar:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error al registrar voto'
      };
    } finally {
      setLoading(false);
    }
  };

  // Función auxiliar para actualizar el estado de voto de un candidato
  const updateCandidatoVoteStatus = (candidato: Candidato) => {
    // Actualizar la lista de candidatos para reflejar el voto
    // El contador de votos se actualizará automáticamente en la próxima carga desde la API
    setAllCandidatos(prevCandidatos =>
      prevCandidatos.map(c => {
        // Si es el mismo candidato por el que votamos, actualizamos su estado
        if ((c._id && c._id === candidato._id) ||
          (c.idCandidato && c.idCandidato === candidato.idCandidato)) {
          return {
            ...c,
            userHasVoted: true,
            // Incrementar temporalmente el contador para una experiencia de usuario más fluida
            // En la próxima carga, se obtendrá el valor real desde la base de datos
            totalVotos: (c.totalVotos || 0) + 1
          };
        }
        return c;
      })
    );

    // También actualizar los candidatos mostrados
    setDisplayedCandidatos(prevDisplayed =>
      prevDisplayed.map(c => {
        if ((c._id && c._id === candidato._id) ||
          (c.idCandidato && c.idCandidato === candidato.idCandidato)) {
          return {
            ...c,
            userHasVoted: true,
            // Incrementar temporalmente el contador para una experiencia de usuario más fluida
            totalVotos: (c.totalVotos || 0) + 1
          };
        }
        return c;
      })
    );

    // Opcional: Recargar los datos después de un breve retraso para obtener el conteo actualizado desde la API
    // Esto asegura que los datos estén sincronizados con la base de datos
    setTimeout(() => {
      fetchCandidatos();
    }, 2000); // Esperar 2 segundos para dar tiempo a que la base de datos se actualice
  };

  const handleDenunciar = async (candidato: Candidato, userId: string | null | undefined) => {
    if (!userId) {
      return { success: false, message: 'Usuario no autenticado' };
    }

    try {
      // Usar el _id de MongoDB en lugar de idCandidato
      const candidatoId = candidato._id || candidato.idCandidato;



      const response = await fetch('/api/denuncias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          candidatoId,
          tipoCatalogo: 'candidatos' // Usar un valor fijo para evitar problemas con el tipo
        }),
      });

      if (response.ok) {
        return { success: true, message: 'Denuncia registrada exitosamente' };
      } else {
        return { success: false, message: 'Error al registrar la denuncia' };
      }
    } catch (error) {
      console.error('Error al denunciar:', error);
      return { success: false, message: 'Error al registrar la denuncia' };
    }
  };

  return {
    allCandidatos,
    displayedCandidatos,
    loading,
    error,
    currentPage,
    totalPages,
    totalCandidatos,
    tipoCatalogo,
    searchQuery,
    entidadId,
    fetchCandidatos,
    handlePageChange,
    handleVotar,
    handleDenunciar,
    setTipoCatalogo,
    setSearchQuery,
    setEntidadId
  };
}
