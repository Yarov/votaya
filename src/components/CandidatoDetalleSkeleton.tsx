import React from 'react';

const CandidatoDetalleSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section con foto y nombre - skeleton */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white mt-0">
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-12 md:py-16">
          {/* Navegación superior y acciones - skeleton */}
          <div className="flex justify-between items-center mb-8">
            {/* Botón volver - skeleton */}
            <div className="w-36 h-8 bg-white/10 rounded-full animate-pulse"></div>
            
            {/* Botones de acción - skeleton */}
            <div className="flex space-x-3">
              <div className="w-20 h-8 bg-gray-600 rounded-full animate-pulse"></div>
              <div className="w-24 h-8 bg-white/10 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Foto circular - skeleton */}
            <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden bg-white/20 flex-shrink-0 border-4 border-white/30 animate-pulse"></div>
            
            {/* Información principal - skeleton */}
            <div className="text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4">
                <div>
                  {/* Nombre - skeleton */}
                  <div className="h-10 bg-white/20 rounded w-64 mb-2 animate-pulse"></div>
                  
                  {/* Cargo - skeleton */}
                  <div className="h-6 bg-white/20 rounded w-48 mt-1 animate-pulse"></div>
                  
                  {/* Organización postulante - skeleton */}
                  <div className="h-6 bg-white/20 rounded w-40 mt-1 animate-pulse"></div>
                </div>
              </div>
              
              {/* Datos adicionales - skeleton */}
              <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="bg-white/10 rounded-full w-24 h-6 animate-pulse"></div>
                <div className="bg-white/10 rounded-full w-20 h-6 animate-pulse"></div>
                <div className="bg-white/10 rounded-full w-32 h-6 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navegación por secciones - skeleton */}
        <div className="bg-white shadow-sm rounded-lg p-1.5 mb-8 flex overflow-x-auto sticky top-14 md:top-0 z-40 border border-gray-100">
          <div className="px-4 py-2 mx-1 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-sm animate-pulse w-28 h-9"></div>
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="px-4 py-2 mx-1 rounded-full bg-gray-100 animate-pulse w-24 h-9"></div>
          ))}
        </div>

        {/* Descripción - skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-gray-200 p-2 rounded-lg mr-3 animate-pulse">
              <div className="w-5 h-5 bg-gray-400 rounded"></div>
            </div>
            <div className="h-7 bg-gray-300 rounded w-48 animate-pulse"></div>
          </div>
          
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
          </div>
        </div>

        {/* Propuestas - skeleton */}
        <div id="propuestas" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-gray-200 p-2 rounded-lg mr-3 animate-pulse">
              <div className="w-5 h-5 bg-gray-400 rounded"></div>
            </div>
            <div className="h-7 bg-gray-300 rounded w-40 animate-pulse"></div>
          </div>
          
          <div className="mb-8 animate-pulse">
            <div className="flex items-center mb-4">
              <div className="bg-gray-100 p-2 rounded-lg mr-3">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="h-5 bg-gray-300 rounded w-48"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <div className="bg-gradient-to-br from-gray-600 to-gray-800 w-10 h-10 rounded-full mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Experiencia Profesional - skeleton */}
        <div id="experiencia" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-gray-200 p-2 rounded-lg mr-3 animate-pulse">
              <div className="w-5 h-5 bg-gray-400 rounded"></div>
            </div>
            <div className="h-7 bg-gray-300 rounded w-56 animate-pulse"></div>
          </div>
          
          <div className="space-y-8 animate-pulse">
            <div className="space-y-6">
              {[1, 2].map((index) => (
                <div key={index} className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:w-4 before:h-4 before:bg-gray-300 before:rounded-full before:z-10">
                  <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="h-5 bg-gray-300 rounded w-40 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="space-y-1">
                      <div className="h-3 bg-gray-100 rounded w-full"></div>
                      <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Logros y Reconocimientos - skeleton */}
        <div id="logros" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-gray-200 p-2 rounded-lg mr-3 animate-pulse">
              <div className="w-5 h-5 bg-gray-400 rounded"></div>
            </div>
            <div className="h-7 bg-gray-300 rounded w-56 animate-pulse"></div>
          </div>
          
          <div className="space-y-8 animate-pulse">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-5 h-5 bg-gray-300 rounded mr-2"></div>
                <div className="h-5 bg-gray-300 rounded w-40"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex">
                    <div className="bg-gray-200 p-2 rounded-lg mr-3 h-fit">
                      <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    </div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-300 rounded w-40 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                      <div className="space-y-1">
                        <div className="h-3 bg-gray-100 rounded w-full"></div>
                        <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Formación Académica - skeleton */}
        <div id="formacion" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-gray-200 p-2 rounded-lg mr-3 animate-pulse">
              <div className="w-5 h-5 bg-gray-400 rounded"></div>
            </div>
            <div className="h-7 bg-gray-300 rounded w-48 animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            {[1, 2].map((index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="h-5 bg-gray-300 rounded w-40 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Redes Sociales - skeleton */}
        <div id="redes" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-gray-200 p-2 rounded-lg mr-3 animate-pulse">
              <div className="w-5 h-5 bg-gray-400 rounded"></div>
            </div>
            <div className="h-7 bg-gray-300 rounded w-40 animate-pulse"></div>
          </div>
          
          <div className="flex gap-4 animate-pulse">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex items-center">
              <div className="bg-gray-200 p-2 rounded-lg mr-3">
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-40"></div>
            </div>
          </div>
        </div>

        {/* Información de Contacto - skeleton */}
        <div id="contacto" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-gray-200 p-2 rounded-lg mr-3 animate-pulse">
              <div className="w-5 h-5 bg-gray-400 rounded"></div>
            </div>
            <div className="h-7 bg-gray-300 rounded w-48 animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex items-start">
              <div className="bg-gray-200 p-2 rounded-lg mr-3">
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex items-start">
              <div className="bg-gray-200 p-2 rounded-lg mr-3">
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatoDetalleSkeleton;
