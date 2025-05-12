"use client";
import { useState, useEffect } from "react";
import { EntidadFederativa } from "@/utils/entidadesFederativas";
import { FiMapPin, FiChevronDown } from "react-icons/fi";

interface EntidadSelectorProps {
  entidadId: string;
  onEntidadChange: (entidadId: string) => void;
}

export default function EntidadSelector({ entidadId, onEntidadChange }: EntidadSelectorProps) {
  const [entidades, setEntidades] = useState<EntidadFederativa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchEntidades = async () => {
      try {
        const response = await fetch("/api/entidades");
        if (!response.ok) {
          throw new Error("Error al obtener las entidades federativas");
        }
        const data = await response.json();
        setEntidades(data.entidades || []);
      } catch (error) {
        console.error("Error al cargar entidades:", error);
        setError("No se pudieron cargar las entidades federativas");
      } finally {
        setLoading(false);
      }
    };

    fetchEntidades();
  }, []);

  const handleChange = (entidadId: string) => {
    onEntidadChange(entidadId);
    setIsOpen(false);
  };

  // Obtener el nombre de la entidad seleccionada
  const entidadSeleccionada = entidadId 
    ? entidades.find(e => e.id.toString() === entidadId)?.nombre 
    : "Todas las entidades";

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 h-12 rounded-full w-full"></div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm bg-red-50 p-2 rounded-lg border border-red-200">{error}</div>
    );
  }

  return (
    <div className="w-full relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between bg-white border border-gray-300 rounded-full px-4 py-3 cursor-pointer
          transition-all duration-300 ease-in-out ${isOpen ? 'ring-2 ring-gray-800 shadow-lg' : 'shadow-sm'}
          hover:border-gray-600 group`}
      >
        <div className="flex items-center">
          <FiMapPin className="text-gray-500 group-hover:text-gray-800 transition-colors duration-200 mr-3" size={20} />
          <span className="text-gray-800 truncate">{entidadSeleccionada}</span>
        </div>
        <FiChevronDown 
          className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} 
          size={18} 
        />
      </div>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 max-h-60 overflow-y-auto">
          <div 
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-150 flex items-center"
            onClick={() => handleChange("")}
          >
            <span className={`${entidadId === "" ? 'font-medium text-gray-800' : 'text-gray-800'}`}>
              Todas las entidades
            </span>
          </div>
          {entidades.map((entidad) => (
            <div 
              key={entidad.id} 
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-150 flex items-center"
              onClick={() => handleChange(entidad.id.toString())}
            >
              <span className={`${entidadId === entidad.id.toString() ? 'font-medium text-gray-800' : 'text-gray-800'}`}>
                {entidad.nombre}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
