'use client';

import { useEffect, useState } from 'react';
import { Candidato } from '@/types/candidato';
import { useAuth } from '@/hooks/useAuth';
import { useAlerts } from '@/hooks/useAlerts';
import { useUserVotos } from '@/hooks/useUserVotos';
import CandidatoDetalleSkeleton from '@/components/CandidatoDetalleSkeleton';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Tab } from '@headlessui/react';

// Importación de los componentes modulares
// Eliminado import CandidatoNavbar
import CandidatoHero from '@/components/candidato-detalle/CandidatoHero';
import CandidatoDescripcion from '@/components/candidato-detalle/CandidatoDescripcion';
import CandidatoPropuestas from '@/components/candidato-detalle/CandidatoPropuestas';
import CandidatoExperiencia from '@/components/candidato-detalle/CandidatoExperiencia';
import CandidatoLogros from '@/components/candidato-detalle/CandidatoLogros';
import CandidatoFormacion from '@/components/candidato-detalle/CandidatoFormacion';
import CandidatoCursos from '@/components/candidato-detalle/CandidatoCursos';
import CandidatoDenuncias from '@/components/candidato-detalle/CandidatoDenuncias';
import AlertLoginRequired from '@/components/AlertLoginRequired';
import AlertSuccess from '@/components/AlertSuccess';

export default function CandidatoDetalle({ params }: { params: { id: string } }) {
  // Hooks personalizados
  const { userId, isAuthenticated, redirectToSignIn } = useAuth();
  const { hasVoted } = useUserVotos();
  const { 
    showLoginAlert, showSuccessAlert, successMessage,
    displayLoginAlert, displaySuccessAlert, displayErrorAlert,
    closeLoginAlert, closeSuccessAlert
  } = useAlerts();
  
  // Estados
  const [candidato, setCandidato] = useState<Candidato | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [voteLoading, setVoteLoading] = useState(false);
  
  // Verificar si el usuario ya votó por este candidato
  const userHasVoted = hasVoted(params.id);

  // Manejar votación
  const handleVotar = async () => {
    if (!isAuthenticated) {
      displayLoginAlert();
      return;
    }

    if (userHasVoted) {
      displayErrorAlert('Ya has votado por este candidato anteriormente.');
      return;
    }

    setVoteLoading(true);
    try {
      const response = await fetch('/api/votar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidatoId: params.id,
          userId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al registrar el voto');
      }

      displaySuccessAlert('¡Voto registrado correctamente!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrar el voto';
      displayErrorAlert(errorMessage);
    } finally {
      setVoteLoading(false);
    }
  };

  // Manejar denuncia
  const handleDenunciar = () => {
    if (!isAuthenticated) {
      displayLoginAlert();
      return;
    }
    window.location.href = `/denunciar?candidatoId=${params.id}`;
  };

  // Obtener datos del candidato
  useEffect(() => {
    const fetchCandidato = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/candidatos/${params.id}`);
        
        if (!response.ok) {
          throw new Error(`No se pudo obtener la información del candidato (${response.status})`);
        }
        
        const data = await response.json();
        setCandidato(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(`Error al cargar los datos del candidato: ${errorMessage}`);
        console.error('Error al obtener candidato:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCandidato();
    }
  }, [params.id]);

  // Mostrar skeleton durante la carga
  if (loading) {
    return <CandidatoDetalleSkeleton />;
  }

  // Mostrar error si ocurrió alguno
  if (error || !candidato) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || 'No se encontró el candidato solicitado'}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Renderizado con los nuevos componentes
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Alertas */}
      {showLoginAlert && <AlertLoginRequired onClose={closeLoginAlert} />}
      {showSuccessAlert && <AlertSuccess onClose={closeSuccessAlert} message={successMessage} />}
      
      {/* Hero section con foto, datos principales y acciones */}
      <CandidatoHero 
        candidato={candidato} 
        userHasVoted={userHasVoted} 
        handleVotar={handleVotar} 
        handleDenunciar={handleDenunciar} 
        voteLoading={voteLoading} 
      />
      
      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Descripción del candidato */}
        <CandidatoDescripcion candidato={candidato} />
        
        {/* Sistema de pestañas */}
        <div className="mt-8">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
              <Tab
                className={({ selected }: { selected: boolean }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${selected
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-600'}
                  `
                }
              >
                Información del Candidato
              </Tab>
              <Tab
                className={({ selected }: { selected: boolean }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${selected
                    ? 'bg-white text-red-700 shadow'
                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-red-600'}
                  `
                }
              >
                Denuncias y Transparencia
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-2">
              {/* Pestaña de Información del Candidato */}
              <Tab.Panel className="rounded-xl bg-white p-3">
                <div className="space-y-8">
                  <CandidatoPropuestas candidato={candidato} />
                  <CandidatoExperiencia candidato={candidato} />
                  <CandidatoLogros candidato={candidato} />
                  <CandidatoFormacion candidato={candidato} />
                  <CandidatoCursos candidato={candidato} />
                </div>
              </Tab.Panel>
              
              {/* Pestaña de Denuncias */}
              <Tab.Panel className="rounded-xl bg-white p-3">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Transparencia y Rendición de Cuentas</h2>
                  <CandidatoDenuncias candidato={candidato} />
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}