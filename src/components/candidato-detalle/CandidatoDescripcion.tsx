import React from 'react';
import { Candidato } from '@/types/candidato';

interface CandidatoDescripcionProps {
  candidato: Candidato;
}

export default function CandidatoDescripcion({ candidato }: CandidatoDescripcionProps) {
  if (!candidato) return null;

  return (
    <div id="descripcion" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 animate-on-scroll">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Acerca de {candidato.datosPersonales?.nombreCandidato.split(' ')[0]}
      </h2>
      <p className="text-gray-700">
        {candidato.descripcionCandidato || 'No hay descripción disponible.'}
      </p>

      {candidato.razonPostulacion && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h3 className="text-md font-semibold text-gray-700 mb-2">Razón de postulación:</h3>
          <p className="text-gray-600">{candidato.razonPostulacion}</p>
        </div>
      )}

      {candidato.visionImparticionJusticia && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h3 className="text-md font-semibold text-gray-700 mb-2">Visión de impartición de justicia:</h3>
          <p className="text-gray-600">{candidato.visionImparticionJusticia}</p>
        </div>
      )}
      {candidato.motivacion && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h3 className="text-md font-semibold text-gray-700 mb-2">Motivación:</h3>
          <p className="text-gray-600">{candidato.motivacion}</p>
        </div>
      )}
    </div>
  );
}
