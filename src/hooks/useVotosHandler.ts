import { useState, useCallback } from 'react';
import { Candidato } from '@/types/candidato';
import { useCandidatos } from './useCandidatos';
import { useAuth } from './useAuth';
import { SignInButton } from '@clerk/nextjs';

interface UseVotosHandlerProps {
  displayLoginAlert: (options?: { autoHideDuration?: number, onClose?: () => void }) => void;
}

interface UseVotosHandlerReturn {
  isModalOpen: boolean;
  modalMessage: string;
  handleVotar: (candidato: Candidato) => Promise<void>;
  handleDenunciar: (candidato: Candidato) => Promise<void>;
  handleCloseModal: () => void;
}

export function useVotosHandler({ displayLoginAlert }: UseVotosHandlerProps): UseVotosHandlerReturn {
  // Estados para el modal de confirmación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
  // Obtener hooks necesarios
  const { userId, isAuthenticated } = useAuth();
  const {
    fetchCandidatos,
    handleVotar: voteHandler,
    handleDenunciar: denounceHandler,
  } = useCandidatos();

  // Función para cerrar el modal y actualizar datos si es necesario
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    
    // Esperar un momento antes de actualizar los datos
    // Esto da tiempo para que las animaciones del modal terminen
    setTimeout(() => {
      // Actualizar los datos después de cerrar el modal
      // Esto asegura que los cambios sean visibles inmediatamente
      fetchCandidatos();
    }, 300);
  }, [fetchCandidatos]);

  // Función para manejar el voto
  const handleVotar = useCallback(async (candidato: Candidato) => {
    // Verificar autenticación
    if (!isAuthenticated || !userId) {

      // Mostrar el modal de inicio de sesión usando Clerk
      displayLoginAlert({ autoHideDuration: 0 });
      return;
    }
    

    
    // Si el usuario ya votó por este candidato, mostrar mensaje personalizado y no hacer nada más
    if (candidato.userHasVoted) {
      // Mensaje simplificado sin el nombre del candidato
      setModalMessage(`Gracias por tu participación.`);
      setIsModalOpen(true);
      return;
    }
    
    // Guardar el total de votos actual antes de la actualización
    const votosPrevios = candidato.totalVotos || 0;
    
    // Obtener el ID del candidato para el voto
    const candidatoId = candidato._id || candidato.idCandidato;

    
    // Crear una copia modificada del candidato con userHasVoted=true y totalVotos incrementado
    const candidatoModificado = {
      ...candidato,
      userHasVoted: true,
      totalVotos: votosPrevios + 1 // Incrementar el contador localmente
    };
    
    try {
      // Actualizar inmediatamente la UI para mostrar el incremento del voto
      const allCandidatos = document.querySelectorAll(`[data-candidato-id="${candidatoId}"]`);
      allCandidatos.forEach(element => {
        const voteCountElement = element.querySelector('[data-vote-count]');
        if (voteCountElement) {
          voteCountElement.textContent = `${votosPrevios + 1} votos`;
        }
      });
      

      
      // Llamar directamente al endpoint de votación para asegurar que se guarde en MongoDB
      const response = await fetch('/api/votar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          candidatoId,
          tipoCatalogo: 'candidatos'
        }),
      });
      
      const responseData = await response.json();

      
      // También llamamos a la función del hook para mantener la consistencia
      const result = await voteHandler(candidatoModificado, userId);

      
      if (result.success) {
        // Mostrar el modal de confirmación con un mensaje simplificado
        setModalMessage(`¡Gracias por tu participación! Tu voto ha sido registrado correctamente.`);
        setIsModalOpen(true);
        
        // Forzar una recarga completa para asegurar que todo se actualice
        setTimeout(() => {
          fetchCandidatos();
        }, 300);
      } else {
        if (result.message === 'Usuario no autenticado') {
          displayLoginAlert({ autoHideDuration: 0 });
        } else if (result.message && result.message.includes('Ya has votado')) {
          // Si el error es porque ya votó, marcar el candidato como votado
          candidato.userHasVoted = true;
          fetchCandidatos();
          setModalMessage(`Gracias por tu participación.`);
          setIsModalOpen(true);
        } else {
          // Revertir el incremento local del contador si hubo un error
          allCandidatos.forEach(element => {
            const voteCountElement = element.querySelector('[data-vote-count]');
            if (voteCountElement) {
              voteCountElement.textContent = `${votosPrevios} votos`;
            }
          });
          
          setModalMessage(result.message || 'Error al registrar el voto');
          setIsModalOpen(true);
        }
      }
    } catch (error) {
      console.error('Error al procesar el voto:', error);
      setModalMessage('Ha ocurrido un error al procesar tu voto. Por favor, intenta nuevamente.');
      setIsModalOpen(true);
    }
  }, [isAuthenticated, userId, voteHandler, fetchCandidatos, displayLoginAlert]);

  // Función para manejar la denuncia
  const handleDenunciar = useCallback(async (candidato: Candidato) => {
    if (!isAuthenticated) {
      // Mostrar el modal de login requerido con mensaje personalizado
      displayLoginAlert({ autoHideDuration: 0 });
      return;
    }
    
    const result = await denounceHandler(candidato, userId);
    setModalMessage(result.message || 'Denuncia procesada');
    setIsModalOpen(true);
  }, [isAuthenticated, userId, denounceHandler, displayLoginAlert]);

  return {
    isModalOpen,
    modalMessage,
    handleVotar,
    handleDenunciar,
    handleCloseModal
  };
}
