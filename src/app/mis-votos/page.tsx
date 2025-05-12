'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import AlertLoginRequired from '@/components/AlertLoginRequired';
import Image from 'next/image';
import Link from 'next/link';
import { formatImageUrl } from '@/utils/imageUtils';
import { formatDate, formatRelativeTime } from '@/utils/dateUtils';
import Pagination from '@/components/Pagination';

interface Candidato {
  _id: string;
  idCandidato?: string;
  datosPersonales?: {
    nombreCandidato?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    urlFoto?: string;
    poderPostula?: string[];
    cargoPostula?: string;
    numListaBoleta?: string;
  };
  cargo?: string;
  partido?: string;
}

interface Voto {
  _id: string;
  candidatoId: string;
  timestamp: string;
  candidato: Candidato | null;
}

export default function MisVotos() {
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const { isLoaded, userId } = useAuth();
  useEffect(() => {
    if (isLoaded && !userId) setShowLoginAlert(true);
  }, [isLoaded, userId]);
  const [allVotos, setAllVotos] = useState<Voto[]>([]);
  const [displayedVotos, setDisplayedVotos] = useState<Voto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [votoToDelete, setVotoToDelete] = useState<string | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const votosPorPagina = 10;

  const fetchVotos = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/votos/usuario?userId=${userId}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'VotoCiudadano/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error('No se pudieron cargar tus votos');
      }
      
      const data = await response.json();
      setAllVotos(data.votos || []);
      
      // Calcular el total de páginas
      setTotalPages(Math.ceil(data.votos.length / votosPorPagina) || 1);
      
      // Mostrar la primera página
      const startIndex = 0;
      const endIndex = votosPorPagina;
      setDisplayedVotos(data.votos.slice(startIndex, endIndex));
      
    } catch (error) {
      console.error('Error al obtener votos:', error);
      setError('No se pudieron cargar tus votos. Intenta nuevamente.');
      setAllVotos([]);
      setDisplayedVotos([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };
  
  // Función para eliminar un voto
  const handleDeleteVoto = async (votoId: string) => {
    if (!userId) return;
    
    setDeleteLoading(votoId);
    setDeleteMessage(null);
    
    try {
      const response = await fetch(`/api/votos/eliminar?votoId=${votoId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar el voto');
      }
      
      // Actualizar la lista de votos eliminando el voto
      const updatedAllVotos = allVotos.filter(voto => voto._id !== votoId);
      setAllVotos(updatedAllVotos);
      
      // Actualizar los votos mostrados
      const startIndex = (currentPage - 1) * votosPorPagina;
      const endIndex = startIndex + votosPorPagina;
      setDisplayedVotos(updatedAllVotos.slice(startIndex, endIndex));
      
      // Si la página actual queda vacía y no es la primera página, ir a la página anterior
      if (updatedAllVotos.length > 0 && 
          displayedVotos.length === 1 && 
          currentPage > 1) {
        handlePageChange(currentPage - 1);
      }
      
      // Actualizar el total de páginas
      setTotalPages(Math.ceil(updatedAllVotos.length / votosPorPagina) || 1);
      
      setDeleteMessage({
        type: 'success',
        text: 'Voto eliminado correctamente'
      });
      
      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => {
        setDeleteMessage(null);
      }, 3000);
      
    } catch (error) {
      console.error('Error al eliminar voto:', error);
      setDeleteMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error al eliminar el voto'
      });
      
      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => {
        setDeleteMessage(null);
      }, 3000);
    } finally {
      setDeleteLoading(null);
      setVotoToDelete(null);
      setShowConfirmModal(false);
    }
  };
  
  // Función para mostrar el modal de confirmación
  const confirmDeleteVoto = (votoId: string) => {
    setVotoToDelete(votoId);
    setShowConfirmModal(true);
  };
  
  // Función para cancelar la eliminación
  const cancelDeleteVoto = () => {
    setVotoToDelete(null);
    setShowConfirmModal(false);
  };
  
  // Cargar votos al montar el componente
  useEffect(() => {
    if (userId) {
      fetchVotos();
    }
  }, [userId]);
  
  // Función para cambiar de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const startIndex = (page - 1) * votosPorPagina;
    const endIndex = startIndex + votosPorPagina;
    setDisplayedVotos(allVotos.slice(startIndex, endIndex));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Si el usuario no está autenticado, mostrar alerta
  if (showLoginAlert) {
    return <AlertLoginRequired message="Para ver tus votos, debes iniciar sesión" />;
  }

  return (
    <div>
      {/* Espacio para compensar el navbar fijo */}
      <div className="h-16"></div>
      
      <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-9rem)] flex flex-col">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mis Votos</h1>
      
      {/* Modal de confirmación para eliminar voto */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/1">
          <div className="bg-white/90 rounded-lg shadow-xl max-w-md w-full mx-4 p-6 transform transition-all border border-gray-200">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">¿Estás seguro que deseas eliminar este voto?</h3>
              <p className="text-sm text-gray-500 mb-4">Esta acción no se puede deshacer.</p>
              <div className="flex space-x-2">
                <button
                  onClick={cancelDeleteVoto}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => votoToDelete && handleDeleteVoto(votoToDelete)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Mensaje de notificación */}
      {deleteMessage && (
        <div className={`mb-4 p-4 rounded-md ${deleteMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {deleteMessage.type === 'success' ? (
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{deleteMessage.text}</p>
            </div>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center py-20 flex-grow">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex-grow">
          <p>{error}</p>
        </div>
      ) : displayedVotos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-6 text-center flex-grow">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No has emitido ningún voto</h3>
          <p className="text-gray-600 mb-4">Cuando votes por candidatos, podrás ver tu historial de votos aquí.</p>
          <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-700">
            Explorar candidatos
          </Link>
        </div>
      ) : (
        <div className="flex-grow">
          <div className="grid gap-4 mb-6">
            {displayedVotos.map((voto) => (
              <div key={voto._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="p-4 flex items-start">
                  <div className="w-16 h-16 relative rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0 mr-4">
                    <Image
                      src={formatImageUrl(voto.candidato?.datosPersonales?.urlFoto || '/placeholder-profile.jpg')}
                      alt={voto.candidato?.datosPersonales?.nombreCandidato || 'Candidato'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">
                          {voto.candidato?.datosPersonales?.nombreCandidato || 'Candidato no disponible'}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {Array.isArray(voto.candidato?.datosPersonales?.poderPostula) 
                            ? voto.candidato?.datosPersonales?.poderPostula.map(poder => {
                                const poderMap: Record<string, string> = {
                                  '1': 'Salas Regionales',
                                  '2': 'Sala Superior',
                                  '3': 'Tribunal de Disciplina',
                                  '4': 'Tribunales',
                                  '5': 'Suprema Corte'
                                };
                                return poderMap[poder] || poder;
                              }).join(', ')
                            : voto.candidato?.datosPersonales?.cargoPostula || 'Cargo no especificado'
                          }
                        </p>
                        {voto.candidato?.datosPersonales?.numListaBoleta && (
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full mt-1">
                            #{voto.candidato.datosPersonales.numListaBoleta}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          Votado
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(new Date(voto.timestamp))}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatRelativeTime(new Date(voto.timestamp))}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-end">
                      <button 
                        onClick={() => confirmDeleteVoto(voto._id)}
                        disabled={deleteLoading === voto._id}
                        className={`text-sm flex items-center ${deleteLoading === voto._id ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-800'}`}
                      >
                        {deleteLoading === voto._id ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Eliminando...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Eliminar voto</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Paginación */}
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          )}
        </div>
      )}
      </div>
    </div>
  );
}
