import React from 'react';

const CandidatoCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Placeholder para la imagen */}
      <div className="w-full h-48 bg-gray-300"></div>
      
      <div className="p-4">
        {/* Placeholder para el título */}
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
        
        {/* Placeholder para la descripción */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        
        {/* Placeholder para el botón */}
        <div className="mt-4 h-10 bg-gray-300 rounded w-full"></div>
      </div>
    </div>
  );
};

export default CandidatoCardSkeleton;
