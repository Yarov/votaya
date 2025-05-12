import React from 'react';
import { Candidato } from '@/types/candidato';
import { CalendarIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

interface CandidatoExperienciaProps {
  candidato: Candidato;
}

export default function CandidatoExperiencia({ candidato }: CandidatoExperienciaProps) {
  if (!candidato || !candidato.experienciaProfesional || candidato.experienciaProfesional.length === 0) {
    return null;
  }
  
  return (
    <section id="experiencia" className="mb-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Experiencia Profesional</h2>
      
      <div className="space-y-6">
        {candidato.experienciaProfesional.map((experiencia, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="bg-blue-50 rounded-full p-3 flex-shrink-0">
                <BriefcaseIcon className="h-6 w-6 text-blue-600" />
              </div>
              
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">
                  {experiencia.cargo || 'Puesto no especificado'}
                </h3>
                
                <p className="text-gray-600 mt-1">
                  {experiencia.institucion || 'Institución no especificada'}
                </p>
                
                {(experiencia.fechaInicio || experiencia.fechaFin) && (
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>
                      {experiencia.fechaInicio || 'Fecha no especificada'} 
                      {experiencia.fechaFin ? ` - ${experiencia.fechaFin}` : ' - Actual'}
                    </span>
                  </div>
                )}
                
                {experiencia.descripcion && (
                  <p className="mt-3 text-gray-700">
                    {experiencia.descripcion}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
