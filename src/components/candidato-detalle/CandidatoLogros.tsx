import React from 'react';
import { Candidato } from '@/types/candidato';
import { TrophyIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

interface CandidatoLogrosProps {
  candidato: Candidato;
}

export default function CandidatoLogros({ candidato }: CandidatoLogrosProps) {
  if (!candidato) return null;
  
  const tieneLogros = candidato.logros && candidato.logros.length > 0;
  const tieneReconocimientos = candidato.reconocimientos && candidato.reconocimientos.length > 0;
  
  if (!tieneLogros && !tieneReconocimientos) return null;
  
  return (
    <section id="logros" className="mb-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Logros y Reconocimientos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Logros */}
        {tieneLogros && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="bg-amber-50 rounded-full p-2 mr-3">
                <TrophyIcon className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Logros</h3>
            </div>
            
            <div className="space-y-4">
              {candidato.logros?.map((logro, index) => (
                <div key={index} className="bg-gray-50 rounded-md p-3">
                  <h4 className="font-semibold text-gray-800">{logro.titulo}</h4>
                  {logro.anio && <p className="text-xs text-gray-500 mt-1">{logro.anio}</p>}
                  {logro.descripcion && <p className="text-sm text-gray-700 mt-2">{logro.descripcion}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Reconocimientos */}
        {tieneReconocimientos && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="bg-purple-50 rounded-full p-2 mr-3">
                <AcademicCapIcon className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Reconocimientos</h3>
            </div>
            
            <div className="space-y-4">
              {candidato.reconocimientos?.map((reconocimiento, index) => (
                <div key={index} className="bg-gray-50 rounded-md p-3">
                  <h4 className="font-semibold text-gray-800">{reconocimiento.titulo}</h4>
                  {reconocimiento.institucion && <p className="text-sm text-gray-600 mt-1">{reconocimiento.institucion}</p>}
                  {reconocimiento.anio && <p className="text-xs text-gray-500 mt-1">{reconocimiento.anio}</p>}
                  {reconocimiento.descripcion && <p className="text-sm text-gray-700 mt-2">{reconocimiento.descripcion}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
