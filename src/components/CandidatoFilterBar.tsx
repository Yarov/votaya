"use client";
import { useState, useEffect } from "react";
import CandidatoSearch from "./CandidatoSearch";
import EntidadSelector from "./EntidadSelector";
import { FiFilter, FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";

const CATEGORIAS = [
  { value: "salasRegionales", label: "Salas Regionales" },
  { value: "salaSuperior", label: "Sala Superior" },
  { value: "tribunalDJ", label: "Trib. Disciplina Judicial" },
  { value: "tribunales", label: "Tribunales" },
  { value: "supremacorte", label: "Suprema Corte" },
];

interface CandidatoFilterBarProps {
  categoria: string;
  onCategoriaChange: (cat: string) => void;
  searchQuery: string;
  onSearch: (q: string) => void;
  entidadId: string;
  onEntidadChange: (entidadId: string) => void;
}

export default function CandidatoFilterBar({ categoria, onCategoriaChange, searchQuery, onSearch, entidadId, onEntidadChange }: CandidatoFilterBarProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  
  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Comprobar al cargar
    checkIfMobile();
    
    // Comprobar al cambiar el tamaño de la ventana
    window.addEventListener('resize', checkIfMobile);
    
    // Limpiar el event listener
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // En dispositivos de escritorio, mostrar siempre los filtros
  useEffect(() => {
    if (!isMobile) {
      setIsFiltersOpen(true);
    } else {
      setIsFiltersOpen(false); // En móvil, inicialmente cerrado
    }
  }, [isMobile]);
  
  // Calcular cuántos filtros están activos
  useEffect(() => {
    let count = 0;
    if (categoria) count++;
    if (searchQuery) count++;
    if (entidadId) count++;
    setActiveFilters(count);
  }, [categoria, searchQuery, entidadId]);
  
  const resetFilters = () => {
    onCategoriaChange("");
    onSearch("");
    onEntidadChange("");
  };
  
  // Componente para móvil (sticky)
  if (isMobile) {
    return (
      <div className="fixed top-16 left-0 right-0 w-full z-20 overflow-x-hidden">
        {/* Barra de filtros sticky para móvil - ancho completo */}
        <div className="bg-white shadow-md border-b border-gray-200 w-full">
          <div className="flex items-center justify-between px-4 py-3 overflow-x-hidden md:container md:mx-auto">
            <button 
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="flex items-center justify-between w-full"
              aria-expanded={isFiltersOpen}
            >
              <div className="flex items-center">
                <FiFilter className="text-gray-800 mr-2" size={18} />
                <span className="font-medium text-gray-800">Filtros</span>
                {activeFilters > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-gray-800 text-white text-xs rounded-full">
                    {activeFilters}
                  </span>
                )}
              </div>
              {isFiltersOpen ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
            </button>
          </div>
          
          {/* Panel de filtros desplegable - ancho completo */}
          {isFiltersOpen && (
            <div className="w-full border-t border-gray-100 bg-gray-50 transition-all duration-300 ease-in-out left-0 right-0 overflow-x-hidden">
              <div className="px-4 py-3 overflow-x-hidden md:container md:mx-auto">
                <div className="flex justify-end mb-3">
                  <button
                    onClick={resetFilters}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center transition-colors"
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Resetear
                  </button>
                </div>
                
                {/* Categorías */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-600 mb-2">Tipo de candidato</p>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIAS.map(cat => (
                      <button
                        key={cat.value}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                          categoria === cat.value
                            ? "bg-gray-800 text-white shadow-md hover:bg-gray-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        onClick={() => onCategoriaChange(cat.value)}
                        type="button"
                        aria-pressed={categoria === cat.value}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Búsqueda */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-600 mb-1">Buscar por nombre</p>
                  <CandidatoSearch onSearch={onSearch} initialValue={searchQuery} />
                </div>
                
                {/* Entidad */}
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Entidad federativa</p>
                  <EntidadSelector entidadId={entidadId} onEntidadChange={onEntidadChange} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Componente para escritorio (normal)
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 transition-all duration-300 md:container md:mx-auto">
      {/* Cabecera de filtros */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FiFilter className="text-gray-800 mr-2" size={20} />
          <h2 className="text-lg font-semibold text-gray-800">Filtros</h2>
          {activeFilters > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-gray-800 text-white text-xs rounded-full">
              {activeFilters}
            </span>
          )}
        </div>
        
        <button
          onClick={resetFilters}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Resetear filtros
        </button>
      </div>
      
      {/* Contenido de filtros */}
      <div className="flex flex-col space-y-6">
        {/* Categorías */}
        <div className="w-full">
          <p className="text-sm font-medium text-gray-600 mb-2">Tipo de candidato</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIAS.map(cat => (
              <button
                key={cat.value}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  categoria === cat.value
                    ? "bg-gray-800 text-white shadow-md hover:bg-gray-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => onCategoriaChange(cat.value)}
                type="button"
                aria-pressed={categoria === cat.value}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Búsqueda y Entidad */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <p className="text-sm font-medium text-gray-600 mb-2">Buscar por nombre</p>
            <CandidatoSearch onSearch={onSearch} initialValue={searchQuery} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Entidad federativa</p>
            <EntidadSelector entidadId={entidadId} onEntidadChange={onEntidadChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
