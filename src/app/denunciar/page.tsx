'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SignInButton } from '@clerk/nextjs';
import Image from 'next/image';
import { Candidato } from '@/types/candidato';
import { formatImageUrl } from '@/utils/imageUtils';
import { useAuth } from '@/hooks/useAuth';

// Componente interno que usa useSearchParams
function DenunciarForm() {
  const searchParams = useSearchParams();
  const candidatoId = searchParams.get('candidatoId');
  const id = candidatoId || null;
  const { user, isAuthenticated, isLoading } = useAuth();
  const [candidato, setCandidato] = useState<Candidato | null>(null);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [denunciaDate, setDenunciaDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      setError('Por favor, inicia sesión para denunciar');
      return;
    }

    if (id) {
      fetchCandidato(id);
    }
  }, [id, isAuthenticated, isLoading]);

  const fetchCandidato = async (id: string) => {
    try {
      const response = await fetch(`/api/candidatos/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener el candidato');
      }
      const data = await response.json();
      setCandidato(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar el candidato');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError('');
    setSuccess(false);

    if (!isAuthenticated) {
      setError('Por favor, inicia sesión para denunciar');
      setEnviando(false);
      return;
    }

    try {
      const denunciaData = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        candidatoId: id
      };

      const response = await fetch('/api/denuncias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(denunciaData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al enviar la denuncia');
      }

      // Obtener la fecha actual cuando se crea la denuncia
      setDenunciaDate(new Date());
      setSuccess(true);
      setEnviando(false);
      setFormData({
        titulo: '',
        descripcion: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar la denuncia. Por favor, intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-t-xl">
            <h1 className="text-2xl font-bold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Denunciar irregularidades
            </h1>
            <p className="mt-1 text-red-100">Ayúdanos a mantener la transparencia en el proceso electoral</p>
          </div>
          <div className="p-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Para denunciar irregularidades, primero necesitas iniciar sesión.
              </p>
              <SignInButton mode="modal" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-t-xl">
            <h1 className="text-2xl font-bold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Denunciar irregularidades
            </h1>
            <p className="mt-1 text-red-100">Ayúdanos a mantener la transparencia en el proceso electoral</p>
          </div>
          <div className="p-6">
            <div className="text-center">
              <p className="text-gray-600">Cargando información del candidato...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!candidato) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-t-xl">
            <h1 className="text-2xl font-bold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Denunciar irregularidades
            </h1>
            <p className="mt-1 text-red-100">Ayúdanos a mantener la transparencia en el proceso electoral</p>
          </div>
          <div className="p-6">
            <div className="text-center">
              <p className="text-red-600">No se encontró el candidato especificado.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-red-500 text-white p-4">
          <h1 className="text-xl font-bold">Denunciar irregularidades</h1>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 relative rounded-full overflow-hidden">
              <Image
                src={formatImageUrl(candidato.datosPersonales.urlFoto)}
                alt={candidato.datosPersonales.nombreCandidato}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-medium">Denuncia relacionada con:</h2>
              <p className="text-gray-700">{candidato.datosPersonales.nombreCandidato}</p>
            </div>
          </div>

          {success ? (
            <div className="p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-lg text-green-800 text-center border border-green-200 shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full border-4 border-green-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-green-700">¡Gracias por tu denuncia!</h2>
              <p className="mb-4 text-lg">Has realizado una denuncia importante el {denunciaDate?.toLocaleDateString('es-MX', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
              <p className="text-green-700 font-medium">¡Excelente ciudadano! Tu participación es fundamental para mejorar nuestro sistema.</p>
              <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
                <p className="text-sm text-gray-600">Tu denuncia ha sido registrada con el número de folio: <span className="font-mono font-bold">{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</span></p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {error && (
                <div className="text-red-600 text-sm mb-6">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Título de la denuncia</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={formData.titulo}
                      onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                      className="pl-10 pr-4 py-3 w-full bg-white border border-gray-200 rounded-lg shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 text-sm transition duration-200 ease-in-out"
                      placeholder="Breve título para la denuncia"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Descripción detallada</label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <textarea
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      rows={6}
                      className="pl-10 pr-4 py-3 w-full bg-white border border-gray-200 rounded-lg shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 text-sm transition duration-200 ease-in-out"
                      placeholder="Describe con detalle la irregularidad que deseas denunciar..."
                      required
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">Tu denuncia será registrada con la fecha actual y será revisada por nuestro equipo.</p>
                </div>



                <div>
                  <button
                    type="submit"
                    disabled={enviando}
                    className="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out"
                  >
                    {enviando ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Enviar denuncia
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente principal envuelto en Suspense
export default function DenunciarPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Cargando formulario de denuncia...</div>}>
      <DenunciarForm />
    </Suspense>
  );
}
