
'use client';

import { Candidato, TipoCatalogo } from '@/types/candidato';
import AlertLoginRequired from '@/components/AlertLoginRequired';
import AlertSuccess from '@/components/AlertSuccess';
import CandidatoCard from '@/components/CandidatoCard';
import CandidatoCardSkeleton from '@/components/CandidatoCardSkeleton';
import Pagination from '@/components/Pagination';
import CandidatoFilterBar from '@/components/CandidatoFilterBar';
import ConfirmationModal from '@/components/ConfirmationModal';
import { useCandidatos } from '@/hooks/useCandidatos';
import { useAlerts } from '@/hooks/useAlerts';
import { useVotosHandler } from '@/hooks/useVotosHandler';
import useHomeCardsAnimation from '@/hooks/useScrollAnimation';

export default function Home() {
  // Activar el efecto de elevación para las cards de candidatos en dispositivos móviles
  useHomeCardsAnimation();
  
  // Usar el hook personalizado para manejar las alertas
  const {
    showLoginAlert,
    showSuccessAlert,
    successMessage,
    displayLoginAlert,
    closeLoginAlert,
    closeSuccessAlert
  } = useAlerts();
  
  // Usar el hook personalizado para manejar la lógica de candidatos
  const {
    allCandidatos,
    displayedCandidatos,
    loading,
    error,
    currentPage,
    totalPages,
    tipoCatalogo,
    searchQuery,
    entidadId,
    fetchCandidatos,
    handlePageChange,
    setTipoCatalogo,
    setSearchQuery,
    setEntidadId
  } = useCandidatos();

  // Usar el nuevo hook para manejar votos y denuncias
  const {
    isModalOpen,
    modalMessage,
    handleVotar,
    handleDenunciar,
    handleCloseModal
  } = useVotosHandler({ displayLoginAlert });

  return (
    <div className="min-h-[calc(100vh-9rem)]">
      {/* Modal de confirmación */}
      <ConfirmationModal 
        isOpen={isModalOpen} 
        message={modalMessage} 
        onConfirm={handleCloseModal} 
      />
      
      {/* Espacio para compensar el navbar fijo y el filtro sticky en móvil */}
      <div className="md:hidden h-14"></div>
      
      <div className="container mx-auto px-4 py-8 overflow-x-hidden">
        <CandidatoFilterBar
          categoria={tipoCatalogo}
          onCategoriaChange={(cat) => {
            setTipoCatalogo(cat as TipoCatalogo);
            setSearchQuery("");
          }}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          entidadId={entidadId}
          onEntidadChange={(id) => {
            setEntidadId(id);
          }}
        />

        {showLoginAlert && <AlertLoginRequired onClose={closeLoginAlert} />}
        {showSuccessAlert && <AlertSuccess onClose={closeSuccessAlert} message={successMessage} />}
        {error && (
          <div className="text-center py-8">
            <div className="text-red-600 font-medium mb-2">{error}</div>
            <button 
              onClick={fetchCandidatos}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
            >
              Reintentar
            </button>
          </div>
        )}

        {loading ? (
          // Mostrar skeletons durante la carga
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <CandidatoCardSkeleton key={index} />
            ))}
          </div>
        ) : displayedCandidatos.length > 0 ? (
          // Mostrar candidatos si hay datos
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedCandidatos.map((candidato) => (
                <CandidatoCard
                  key={candidato._id || candidato.idCandidato}
                  candidato={candidato}
                  onVotar={handleVotar}
                  onDenunciar={handleDenunciar}
                />
              ))}
            </div>
            {/* Componente de paginación */}
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
            {/* Información sobre la paginación */}
            <div className="text-center text-sm text-gray-500 mt-2">
              Mostrando {displayedCandidatos.length} de {allCandidatos.length} candidatos
            </div>
          </>
        ) : !error ? (
          // Mostrar mensaje si no hay candidatos y no hay error
          <div className="col-span-3 text-center py-8 text-gray-500">
            No se encontraron candidatos para esta categoría.
          </div>
        ) : null}
      </div>
    </div>
  );
}
