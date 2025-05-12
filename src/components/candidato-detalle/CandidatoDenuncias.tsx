'use client';

import { useState, useEffect } from 'react';
import { Candidato } from '@/types/candidato';
import { useAuth } from '@/hooks/useAuth';
import { SignInButton } from '@clerk/nextjs';
import AlertLoginRequired from '@/components/AlertLoginRequired';

interface Denuncia {
  _id: string;
  titulo: string;
  descripcion: string;
  estado: string;
  fechaCreacionFormateada: string;
  userId: string;
  usuario?: {
    id: string;
    nombre: string;
    email: string;
    imageUrl: string;
    username: string;
  };
}

interface CandidatoDenunciasProps {
  candidato: Candidato;
}

export default function CandidatoDenuncias({ candidato }: CandidatoDenunciasProps) {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const [selectedDenuncia, setSelectedDenuncia] = useState<Denuncia | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (candidato && candidato._id) {
      console.log('Candidato ID para buscar denuncias:', candidato._id);
      fetchDenuncias();
    }
  }, [candidato._id]); // Dependencia explícita en candidato._id para asegurar que se actualiza correctamente

  const fetchDenuncias = async () => {
    if (!candidato || !candidato._id) {
      console.error('No hay ID de candidato disponible');
      setError('No se puede cargar las denuncias sin un candidato válido');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null); // Limpiar errores anteriores
      
      // Crear la URL con el ID del candidato
      const candidatoId = candidato._id.toString();
      const url = `/api/denuncias/candidato/${candidatoId}`;
      console.log('Fetching denuncias from:', url);
      
      // Hacer la petición con un timeout para evitar que se quede colgada
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Error al obtener las denuncias: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Denuncias recibidas:', data);
      
      // Verificar que los datos son un array
      if (!Array.isArray(data)) {
        console.error('Los datos recibidos no son un array:', data);
        setDenuncias([]);
      } else {
        setDenuncias(data);
      }
    } catch (err) {
      // Manejar errores específicos
      if (err instanceof DOMException && err.name === 'AbortError') {
        console.error('La petición fue abortada por timeout');
        setError('La petición tomó demasiado tiempo. Por favor, intenta de nuevo.');
      } else {
        console.error('Error fetching denuncias:', err);
        setError('No se pudieron cargar las denuncias');
      }
      
      // En caso de error, establecer un array vacío
      setDenuncias([]);
    } finally {
      setLoading(false);
    }
  };

  const openDenunciaModal = (denuncia: Denuncia) => {
    // Si el usuario no está autenticado, mostrar un mensaje para iniciar sesión
    if (!isAuthenticated) {
      alert('Inicia sesión para ver los detalles completos de la denuncia');
      return;
    }
    
    setSelectedDenuncia(denuncia);
    setShowModal(true);
  };

  const closeDenunciaModal = () => {
    setShowModal(false);
    setSelectedDenuncia(null);
  };

  // Eliminamos la restricción de autenticación para que todos puedan ver las denuncias
  // Solo mantenemos la autenticación para ver detalles completos

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        Denuncias recibidas
        <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {denuncias.length}
        </span>
      </h3>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mb-2"></div>
            <p className="text-sm text-gray-500">Cargando denuncias...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : denuncias.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600">Este candidato no tiene denuncias registradas</p>
        </div>
      ) : (
        <div className="space-y-4">
          {denuncias.map((denuncia) => (
            <div 
              key={denuncia._id} 
              className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-red-200 hover:bg-red-50 transition duration-200 cursor-pointer"
              onClick={() => openDenunciaModal(denuncia)}
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-800">{denuncia.titulo}</h4>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  denuncia.estado === 'PENDIENTE' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {denuncia.estado}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{denuncia.descripcion}</p>
              
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center">
                  {denuncia.usuario?.imageUrl ? (
                    <img 
                      src={denuncia.usuario.imageUrl} 
                      alt={denuncia.usuario.nombre}
                      className="w-6 h-6 rounded-full mr-2 object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full mr-2 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                      {denuncia.usuario?.nombre.charAt(0) || '?'}
                    </div>
                  )}
                  <span className="text-xs font-medium text-gray-700">{denuncia.usuario?.nombre || 'Usuario anónimo'}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {denuncia.fechaCreacionFormateada}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para ver detalles de la denuncia */}
      {showModal && selectedDenuncia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">{selectedDenuncia.titulo}</h3>
                <button 
                  onClick={closeDenunciaModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      selectedDenuncia.estado === 'PENDIENTE' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {selectedDenuncia.estado}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      Reportado el {selectedDenuncia.fechaCreacionFormateada}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    {selectedDenuncia.usuario?.imageUrl ? (
                      <img 
                        src={selectedDenuncia.usuario.imageUrl} 
                        alt={selectedDenuncia.usuario.nombre}
                        className="w-8 h-8 rounded-full mr-2 object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full mr-2 bg-gray-200 flex items-center justify-center text-gray-500">
                        {selectedDenuncia.usuario?.nombre.charAt(0) || '?'}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-800">{selectedDenuncia.usuario?.nombre || 'Usuario anónimo'}</p>
                      {selectedDenuncia.usuario?.email && (
                        <p className="text-xs text-gray-500">{selectedDenuncia.usuario.email}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
                  <p className="text-gray-700 whitespace-pre-line">{selectedDenuncia.descripcion}</p>
                </div>
                
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-sm text-yellow-800">
                  <p className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Esta denuncia está siendo revisada.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button 
                onClick={closeDenunciaModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
