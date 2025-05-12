"use client";
import { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

interface CandidatoSearchProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

export default function CandidatoSearch({ onSearch, initialValue = "" }: CandidatoSearchProps) {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-6">
      <div 
        className={`flex items-center relative overflow-hidden transition-all duration-300 ease-in-out
          ${isFocused ? 'ring-2 ring-gray-800 shadow-lg' : 'shadow-sm'}
          bg-white border border-gray-300 rounded-full px-4 py-3 group hover:border-gray-600`}
      >
        <FiSearch className="text-gray-500 group-hover:text-gray-800 transition-colors duration-200 mr-3" size={20} />
        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="flex-1 outline-none border-none bg-transparent text-gray-800 placeholder-gray-400 w-full"
          value={query}
          onChange={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-label="Buscar candidato por nombre"
        />
        {query && (
          <button 
            onClick={handleClear}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
            aria-label="Limpiar búsqueda"
          >
            <FiX size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
