import { Candidato } from '@/types/candidato';
import { LightBulbIcon, DocumentTextIcon, HeartIcon, SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface CandidatoPropuestasProps {
  candidato: Candidato;
}

export default function CandidatoPropuestas({ candidato }: CandidatoPropuestasProps) {
  // Verificar si hay propuestas o visión para mostrar
  const tienePropuestas = candidato.propuestas && (
    candidato.propuestas.propuesta1 || 
    candidato.propuestas.propuesta2 || 
    candidato.propuestas.propuesta3
  );
  
  const tieneVision = candidato.visionImparticionJusticia;
  const tieneRazon = candidato.razonPostulacion;
  
  // Si no hay nada que mostrar, no renderizar el componente
  if (!tienePropuestas && !tieneVision && !tieneRazon) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-sm border border-blue-100 p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <div className="bg-blue-100 p-2 rounded-lg mr-3">
          <SparklesIcon className="h-5 w-5 text-blue-600" />
        </div>
        Visión y Propuestas
      </h2>
      
      {/* Visión de Impartición de Justicia */}
      {tieneVision && (
        <div className="mb-8 relative overflow-hidden">
          {/* Decoración de fondo */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-blue-100 opacity-30"></div>
          
          <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
            <div className="bg-yellow-100 p-2 rounded-lg mr-3">
              <LightBulbIcon className="h-4 w-4 text-yellow-600" />
            </div>
            Visión de Impartición de Justicia
          </h3>
          <div className="bg-gradient-to-r from-blue-50 to-blue-100/30 p-6 rounded-lg border border-blue-200 shadow-sm relative z-10">
            <div className="absolute -left-1 -top-1 text-blue-200 opacity-30 text-6xl font-serif">"</div>
            <p className="text-gray-800 italic text-lg leading-relaxed relative z-10 pl-6">{candidato.visionImparticionJusticia}</p>
            <div className="absolute -right-1 -bottom-4 text-blue-200 opacity-30 text-6xl font-serif">"</div>
          </div>
        </div>
      )}
      
      {/* Propuestas */}
      {tienePropuestas && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
            <div className="bg-indigo-100 p-2 rounded-lg mr-3">
              <CheckCircleIcon className="h-4 w-4 text-indigo-600" />
            </div>
            Propuestas Principales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {candidato.propuestas?.propuesta1 && (
              <div className="group bg-white p-5 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center mb-4 font-bold shadow-md group-hover:scale-110 transition-transform">1</div>
                <p className="text-gray-800 leading-relaxed relative z-10">{candidato.propuestas.propuesta1}</p>
              </div>
            )}
            
            {candidato.propuestas?.propuesta2 && (
              <div className="group bg-white p-5 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center mb-4 font-bold shadow-md group-hover:scale-110 transition-transform">2</div>
                <p className="text-gray-800 leading-relaxed relative z-10">{candidato.propuestas.propuesta2}</p>
              </div>
            )}
            
            {candidato.propuestas?.propuesta3 && (
              <div className="group bg-white p-5 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center mb-4 font-bold shadow-md group-hover:scale-110 transition-transform">3</div>
                <p className="text-gray-800 leading-relaxed relative z-10">{candidato.propuestas.propuesta3}</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Razón de Postulación */}
      {tieneRazon && (
        <div className="relative overflow-hidden">
          {/* Decoración de fondo */}
          <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-red-100 opacity-20"></div>
          
          <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
            <div className="bg-red-100 p-2 rounded-lg mr-3">
              <HeartIcon className="h-4 w-4 text-red-600" />
            </div>
            Motivación y Razón de Postulación
          </h3>
          <div className="bg-white p-6 rounded-lg border border-blue-100 shadow-sm relative z-10">
            <p className="text-gray-800 leading-relaxed">{candidato.razonPostulacion}</p>
          </div>
        </div>
      )}
    </div>
  );
}
