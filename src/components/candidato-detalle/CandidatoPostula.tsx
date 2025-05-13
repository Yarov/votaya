import React from 'react';

interface PoderPostulaDescriptivo {
  codigo: string;
  descripcion: string;
}

interface CandidatoPostulaProps {
  poderPostulaDescriptivo?: PoderPostulaDescriptivo[];
  cargoPostula?: string;
}

const CandidatoPostula: React.FC<CandidatoPostulaProps> = ({ 
  poderPostulaDescriptivo, 
  cargoPostula 
}) => {
  if (!poderPostulaDescriptivo?.length && !cargoPostula) {
    return null;
  }

  // Función para determinar el color según el código del poder
  const getPoderColor = (codigo: string) => {
    switch (codigo) {
      case '1': // Salas Regionales
        return 'bg-blue-100 text-blue-800';
      case '2': // Sala Superior
        return 'bg-purple-100 text-purple-800';
      case '3': // Tribunal de Disciplina Judicial
        return 'bg-green-100 text-green-800';
      case '4': // Tribunales
        return 'bg-amber-100 text-amber-800';
      case '5': // Suprema Corte
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Mapeo de códigos a nombres completos de poderes
  const getPoderNombreCompleto = (codigo: string, descripcion: string) => {
    switch (codigo) {
      case '1':
      case '2':
      case '3':
      case '4':
        return `PODER JUDICIAL DE LA FEDERACIÓN - ${descripcion}`;
      case '5':
        return `PODER JUDICIAL DE LA FEDERACIÓN - ${descripcion}`;
      default:
        return descripcion;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Postulación</h2>
      
      <div className="flex flex-col space-y-4">
        {poderPostulaDescriptivo && poderPostulaDescriptivo.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Poder que postula:</h3>
            <div className="flex flex-wrap gap-2">
              {poderPostulaDescriptivo.map((poder, index) => (
                <span 
                  key={index} 
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getPoderColor(poder.codigo)}`}
                >
                  {getPoderNombreCompleto(poder.codigo, poder.descripcion)}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {cargoPostula && (
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Cargo al que postula:</h3>
            <p className="text-gray-600 font-medium">{cargoPostula}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidatoPostula;
