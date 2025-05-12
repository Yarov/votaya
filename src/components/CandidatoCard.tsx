'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Candidato } from '@/types/candidato';
import { useState } from 'react';
import AlertLoginRequired from '@/components/AlertLoginRequired';
import { formatImageUrl } from '@/utils/imageUtils';

interface CandidatoCardProps {
  candidato: Candidato;
  onVotar: (candidato: Candidato) => void;
  onDenunciar: (candidato: Candidato) => void;
}

export default function CandidatoCard({ candidato, onVotar, onDenunciar }: CandidatoCardProps) {
  const router = useRouter();
  const { isSignedIn, userId } = useAuth();
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  
  // Obtener el ID del candidato
  const candidatoId = candidato._id || candidato.idCandidato;
  const hasVoted = candidato.userHasVoted;
  const loading = false;
  
  const verDetalle = () => {
    router.push(`/candidato/${candidatoId}`);
  };

  // Truncar la descripción a 100 caracteres
  const descripcionCandidato = candidato.descripcionCandidato || candidato.datosPersonales?.motivacionCargo || 'Sin descripción disponible';
  const descripcionCorta = descripcionCandidato.length > 100 
    ? `${descripcionCandidato.substring(0, 100)}...` 
    : descripcionCandidato;

  return (
    <>
      <div 
        className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 max-w-full candidato-card"
        data-candidato-id={candidatoId}
      >
        {/* Cabecera con número de boleta y conteo de votos */}
        <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
          <span className="font-medium">Candidato</span>
          <div className="flex items-center space-x-2">
            <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center shadow-md relative z-10" data-vote-count>
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <strong data-testid="vote-count">{typeof candidato.totalVotos === 'number' ? candidato.totalVotos : 0} votos</strong>
            </span>
            <span className="bg-white text-gray-800 px-2 py-0.5 rounded-full text-xs font-bold">
              #{candidato.datosPersonales.numListaBoleta}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center space-x-4">
            {/* Imagen del candidato */}
            <div className="w-24 h-24 relative rounded-full overflow-hidden border-2 border-gray-200">
              <Image
                src={formatImageUrl(candidato.datosPersonales.urlFoto || '/placeholder-profile.jpg')}
                alt={candidato.datosPersonales.nombreCandidato || 'Candidato'}
                fill
                className="object-cover"
              />
              {hasVoted && (
                <div className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full p-1 shadow-lg z-10 border-2 border-white animate-pulse">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>

            {/* Información básica */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 truncate">
                  {candidato.datosPersonales.nombreCandidato}
                </h2>
                {hasVoted && (
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full ml-2 flex items-center shadow-md animate-pulse">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Votado
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {Array.isArray(candidato.datosPersonales.poderPostula) 
                  ? candidato.datosPersonales.poderPostula.map(poder => {
                      // Mapear los valores numéricos a nombres descriptivos
                      const poderMap: Record<string, string> = {
                        '1': 'Salas Regionales',
                        '2': 'Sala Superior',
                        '3': 'Tribunal de Disciplina',
                        '4': 'Tribunales',
                        '5': 'Suprema Corte'
                      };
                      return poderMap[poder] || poder;
                    }).join(', ')
                  : candidato.datosPersonales.cargoPostula || 'Cargo no especificado'
                }
              </p>
            </div>
          </div>

          {/* Descripción corta */}
          <div className="mt-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">Descripción</h3>
            <p className="text-sm text-gray-600 line-clamp-3">
              {descripcionCorta}
            </p>
          </div>

          {/* Botones de acción */}
          <div className={`grid ${hasVoted ? 'grid-cols-2' : 'grid-cols-3'} gap-2 mt-4`}>
            <button
              onClick={verDetalle}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center"
            >
              <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Detalles
            </button>
            {!hasVoted && (
              <button
                onClick={() => onVotar(candidato)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center"
              >
                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Votar
              </button>
            )}
             <button
               onClick={() => {
                 if (isSignedIn) {
                   router.push(`/denunciar?candidatoId=${candidatoId}`);
                 } else {
                   setShowLoginAlert(true);
                 }
               }}
               className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center"
             >
               <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
               Denunciar
             </button>
          </div>
        </div>
      </div>
      
      {/* Modal de inicio de sesión */}
      {showLoginAlert && (
        <AlertLoginRequired 
          onClose={() => setShowLoginAlert(false)}
          message="Inicia sesión para denunciar a este candidato"
        />
      )}
    </>
  );
}
