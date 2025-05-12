import React from 'react';
import { Candidato } from '@/types/candidato';
import { AcademicCapIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface CandidatoFormacionProps {
  candidato: Candidato;
}

export default function CandidatoFormacion({ candidato }: CandidatoFormacionProps) {
  // Verificar si hay información académica disponible
  const tieneDescripcionTP = Boolean(candidato?.descripcionTP);
  const tieneDatosAcademicos = candidato?.datosAcademicos?.descripcion;
  
  // Si no hay información académica ni descripción, no mostrar nada
  if (!tieneDescripcionTP && !tieneDatosAcademicos) return null;
  
  return (
    <section id="formacion" className="mb-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Formación Académica</h2>
      
      <div className="space-y-6">
        {/* Datos académicos de la estructura datosAcademicos */}
        {candidato.datosAcademicos?.descripcion && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="bg-blue-50 rounded-full p-3 flex-shrink-0">
                <AcademicCapIcon className="h-6 w-6 text-blue-600" />
              </div>
              
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">
                  Información Académica
                </h3>
                
                <p className="text-gray-700 mt-1">
                  {candidato.datosAcademicos.descripcion}
                </p>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </section>
  );
}
