import React from 'react';
import { Candidato, CursoCandidato } from '@/types/candidato';
import { AcademicCapIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface CandidatoCursosProps {
  candidato: Candidato;
}

export default function CandidatoCursos({ candidato }: CandidatoCursosProps) {
  // Verificar si el candidato tiene cursos
  const tieneCursos = candidato?.cursosCandidatos && candidato.cursosCandidatos.length > 0;
  
  if (!tieneCursos) return null;
  
  return (
    <section id="cursos" className="mb-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Cursos, diplomados, seminarios, especializaciones</h2>
      
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <ul className="list-disc pl-5 space-y-2">
          {candidato.cursosCandidatos?.map((curso, index) => (
            <li key={`curso-${index}`} className="text-gray-700">
              {curso.descripcion || curso.nombreCurso || 'Curso'}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
