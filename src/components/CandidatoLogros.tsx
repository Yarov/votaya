import { Candidato } from '@/types/candidato';
import { TrophyIcon, StarIcon } from '@heroicons/react/24/outline';

interface CandidatoLogrosProps {
  candidato: Candidato;
}

export default function CandidatoLogros({ candidato }: CandidatoLogrosProps) {
  const tieneLogros = 
    candidato.logros && 
    candidato.logros.length > 0;
  
  const tieneReconocimientos = 
    candidato.reconocimientos && 
    candidato.reconocimientos.length > 0;
  
  if (!tieneLogros && !tieneReconocimientos) {
    return null;
  }
  
  return (
    <div className="bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-sm border border-blue-100 p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <div className="bg-blue-100 p-2 rounded-lg mr-3">
          <TrophyIcon className="h-5 w-5 text-blue-600" />
        </div>
        Logros y Reconocimientos
      </h2>
      
      <div className="space-y-8">
        {/* Logros */}
        {tieneLogros && (
          <div>
            <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
              <TrophyIcon className="h-5 w-5 mr-2" />
              Logros Destacados
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidato.logros?.map((logro, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-blue-100 flex">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3 h-fit">
                    <TrophyIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{logro.titulo || 'Logro no especificado'}</h4>
                    {logro.anio && (
                      <p className="text-sm text-gray-600 mt-1">
                        {logro.anio}
                      </p>
                    )}
                    {logro.descripcion && (
                      <p className="mt-2 text-gray-700">{logro.descripcion}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Reconocimientos */}
        {tieneReconocimientos && (
          <div>
            <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
              <StarIcon className="h-5 w-5 mr-2" />
              Reconocimientos
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidato.reconocimientos?.map((reconocimiento, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-blue-100 flex">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3 h-fit">
                    <StarIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{reconocimiento.titulo || 'Reconocimiento no especificado'}</h4>
                    {reconocimiento.institucion && (
                      <p className="text-blue-600 font-medium">{reconocimiento.institucion}</p>
                    )}
                    {reconocimiento.anio && (
                      <p className="text-sm text-gray-600 mt-1">
                        {reconocimiento.anio}
                      </p>
                    )}
                    {reconocimiento.descripcion && (
                      <p className="mt-2 text-gray-700">{reconocimiento.descripcion}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
