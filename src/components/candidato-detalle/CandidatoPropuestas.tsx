import React from 'react';
import { Candidato } from '@/types/candidato';

interface CandidatoPropuestasProps {
  candidato: Candidato;
}

export default function CandidatoPropuestas({ candidato }: CandidatoPropuestasProps) {
  if (!candidato) return null;
  
  // Verificar si hay propuestas o visión
  const tienePropuestas = candidato.propuestas || candidato.visionImparticionJusticia;
  
  if (!tienePropuestas) return null;
  
  return (
    <section id="propuestas" className="mb-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Propuestas</h2>
      
      <div className="space-y-6">
        {/* Propuestas */}
        {candidato.propuestas && (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {candidato.propuestas.propuesta1 && (
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-blue-600 mb-4">Propuesta 1</h3>
                <p className="text-gray-700">{candidato.propuestas.propuesta1}</p>
              </div>
            )}
            
            {candidato.propuestas.propuesta2 && (
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-indigo-600 mb-4">Propuesta 2</h3>
                <p className="text-gray-700">{candidato.propuestas.propuesta2}</p>
              </div>
            )}
            
            {candidato.propuestas.propuesta3 && (
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-purple-600 mb-4">Propuesta 3</h3>
                <p className="text-gray-700">{candidato.propuestas.propuesta3}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
