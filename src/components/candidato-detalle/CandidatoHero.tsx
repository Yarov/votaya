import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { formatImageUrl } from '@/utils/imageUtils';
import Link from 'next/link';
import { ArrowLeftIcon, CheckBadgeIcon, EnvelopeIcon, PhoneIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Candidato, RedSocial, DatosContacto } from '@/types/candidato';
import { getEntidadById } from '@/utils/entidadesFederativas';
import { useAuth } from '@clerk/nextjs';

interface CandidatoHeroProps {
  candidato: Candidato | null;
  userHasVoted?: boolean;
  handleVotar?: () => void;
  handleDenunciar?: () => void;
  voteLoading?: boolean;
}

export default function CandidatoHero({ 
  candidato, 
  userHasVoted = false, 
  handleVotar = () => {}, 
  handleDenunciar = () => {}, 
  voteLoading = false 
}: CandidatoHeroProps) {
  // Estado local para manejar el estado de votación
  const [localUserHasVoted, setLocalUserHasVoted] = useState(userHasVoted);
  const [localTotalVotos, setLocalTotalVotos] = useState(candidato?.totalVotos || 0);
  const { isSignedIn, userId } = useAuth();

  // Actualizar el estado local cuando las props cambian
  useEffect(() => {
    setLocalUserHasVoted(userHasVoted);
    setLocalTotalVotos(candidato?.totalVotos || 0);
  }, [userHasVoted, candidato?.totalVotos]);

  // Actualizar el estado local cuando se vota
  const handleVote = () => {
    // Simplemente llamar a handleVotar, el hook se encargará del inicio de sesión
    handleVotar();
  };

  if (!candidato) return null;
  
  const getRedSocialIcon = (idTipoRed: number) => {
    switch (idTipoRed) {
      case 1:
        return <FaFacebook className="h-6 w-6" />;
      case 2:
        return <FaTwitter className="h-6 w-6" />;
      case 3:
        return <FaInstagram className="h-6 w-6" />;
      case 6:
        return <FaLinkedin className="h-6 w-6" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white mt-0">
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-12 md:py-16">
        {/* Navegación superior */}
        <div className="flex justify-start items-center mb-8">
          <Link href="/" className="flex items-center text-white hover:text-gray-200 transition-colors">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            <span className="font-medium">Volver al listado</span>
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Foto del candidato */}
          <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden bg-white/20 flex-shrink-0 border-4 border-white/30">
            {candidato.datosPersonales?.urlFoto && (
              <Image 
                src={formatImageUrl(candidato.datosPersonales.urlFoto)} 
                alt={`Foto de ${candidato.datosPersonales?.nombreCandidato || 'candidato'}`}
                fill
                className="object-cover"
              />
            )}
          </div>
          
          {/* Información principal */}
          <div className="text-center md:text-left flex-grow">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 justify-between">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold">
                  {candidato.datosPersonales?.nombreCandidato || 'Nombre no disponible'}
                </h1>
                
                <div className="mt-3 mb-2">
                  <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                    <span className="text-white/80 text-xs uppercase tracking-wider font-semibold">Cargo por el que participa</span>
                    <p className="text-white font-bold text-xl">
                      {candidato.datosPersonales?.cargoPostula || 'Cargo no disponible'}
                    </p>
                  </div>
                </div>
                {candidato.datosPersonales?.fechaNacimiento && (
                  <div className="bg-white/10 px-3 py-1 rounded-full text-sm">
                    {new Date().getFullYear() - new Date(candidato.datosPersonales.fechaNacimiento).getFullYear()} años
                  </div>
                )}
                {(() => {
                  // Verificar si hay un ID de estado válido y es un número
                  if (candidato.idEstadoEleccion === undefined || typeof candidato.idEstadoEleccion !== 'number') {

                    return null;
                  }

                  // No ajustar el ID ya que los IDs en la base de datos coinciden con los del archivo de entidades
                  const entidad = getEntidadById(candidato.idEstadoEleccion);
                  
                  // Si no encontramos la entidad, mostrar un mensaje indicativo
                  if (!entidad) {
                    return (
                      <div className="bg-white/10 px-3 py-1 rounded-full text-sm">
                        Estado: No especificado
                      </div>
                    );
                  }

                  return (
                    <div className="bg-white/10 px-3 py-1 rounded-full text-sm mt-2">
                      Estado: {entidad.nombre}
                    </div>
                  );
                })()}
              </div>
              
              {/* Contadores de votos y denuncias con botones debajo */}
              <div className="flex flex-wrap gap-6 justify-center md:justify-start mt-6">
                {/* Contador de votos con botón de votar */}
                <div className="flex flex-col items-center gap-3 max-w-[160px]">
                  <div className="bg-gradient-to-br from-green-500/80 to-green-700/80 rounded-lg p-4 backdrop-blur-sm shadow-lg text-white flex flex-col items-center justify-center w-full">
                    <div className="flex items-center justify-center mb-1">
                      <CheckBadgeIcon className="h-5 w-5 mr-1 text-green-200" />
                    </div>
                    <span className="block text-3xl font-bold">{localTotalVotos}</span>
                    <span className="text-sm text-green-100">Votos recibidos</span>
                  </div>
                  
                  {/* Botón de votar */}
                  {localUserHasVoted ? (
                    <div className="flex items-center justify-center bg-green-600 text-white px-4 py-3 rounded-lg text-base shadow-md w-full">
                      <CheckBadgeIcon className="h-5 w-5 mr-2" />
                      <span className="font-medium">Votado</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleVote}
                      disabled={voteLoading}
                      className={`${voteLoading ? 'bg-gray-500' : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'} text-white px-4 py-3 rounded-lg text-base font-medium transition-colors shadow-md w-full flex items-center justify-center`}
                    >
                      <CheckBadgeIcon className="h-5 w-5 mr-2" />
                      {voteLoading ? '...' : 'Votar'}
                    </button>
                  )}
                </div>
                
                {/* Contador de denuncias con botón de denunciar */}
                <div className="flex flex-col items-center gap-3 max-w-[160px]">
                  <div className="bg-gradient-to-br from-red-500/80 to-red-700/80 rounded-lg p-4 backdrop-blur-sm shadow-lg text-white flex flex-col items-center justify-center w-full">
                    <div className="flex items-center justify-center mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <span className="block text-3xl font-bold">{(candidato as any).totalDenuncias || 0}</span>
                    <span className="text-sm text-red-100">Denuncias</span>
                  </div>
                  
                  {/* Botón de denunciar */}
                  <button
                    onClick={handleDenunciar}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-3 rounded-lg text-base font-medium transition-colors shadow-md w-full flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Denunciar
                  </button>
                </div>
              </div>
            </div>
            
            {/* Datos adicionales */}
            <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start">
              {/* Redes sociales */}
              {candidato?.redesSociales && candidato.redesSociales.length > 0 && (
                <div className="flex space-x-4">
                  {candidato.redesSociales.map((red: RedSocial, index: number) => {
                    const icon = getRedSocialIcon(red.idTipoRed);
                    if (!icon) return null;
                    
                    // Usar la descripción como URL
                    const url = red.descripcionRed;
                    if (!url) return null;
                    
                    return (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-blue-400 transition-colors"
                        title={red.descripcionRed}
                      >
                        {icon}
                      </a>
                    );
                  })}
                </div>
              )}
              
              {/* Contacto */}
              {candidato?.contacto && (
                <div className="flex space-x-4">
                  {candidato.contacto.correoElecPublico && (
                    <a
                      href={`mailto:${candidato.contacto.correoElecPublico}`}
                      className="text-white hover:text-blue-400 transition-colors"
                      title="Correo electrónico"
                    >
                      <EnvelopeIcon className="h-6 w-6" />
                    </a>
                  )}
                  {candidato.contacto.telefonoPublico && (
                    <a
                      href={`tel:${candidato.contacto.telefonoPublico}`}
                      className="text-white hover:text-blue-400 transition-colors"
                      title="Teléfono"
                    >
                      <PhoneIcon className="h-6 w-6" />
                    </a>
                  )}
                  {candidato.contacto.paginaWeb && (
                    <a
                      href={candidato.contacto.paginaWeb}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-400 transition-colors"
                      title="Página web"
                    >
                      <GlobeAltIcon className="h-6 w-6" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
