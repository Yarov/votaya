'use client';

import { useUser, UserButton, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Navbar = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 shadow-md fixed md:static top-0 left-0 right-0 w-full z-30">
      <div className="md:container md:mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-white font-bold text-xl">
                VotaYA
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              <Link href="/" className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Inicio
              </Link>

              {/* Sección de reportes oculta temporalmente
              <Link href="/reportes" className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Reportes
              </Link>
              */}
              {isLoaded && isSignedIn && (
                <Link href="/mis-votos" className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Mis Votos
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isLoaded && (
              <div className="flex items-center">
                {isSignedIn ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-white text-sm">
                      Hola, {user.firstName || user.username || 'Usuario'}
                    </span>
                    <UserButton 
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          userButtonAvatarBox: "w-10 h-10"
                        }
                      }}
                    />
                  </div>
                ) : (
                  <SignInButton mode="modal">
                    <button className="bg-white text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors border border-gray-300">
                      Iniciar Sesión
                    </button>
                  </SignInButton>
                )}
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-gray-700 focus:outline-none transition-colors"
            >
              <span className="sr-only">Abrir menú principal</span>
              {/* Icono de menú */}
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" className="text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Inicio
            </Link>

            {/* Sección de reportes oculta temporalmente
            <Link href="/reportes" className="text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Reportes
            </Link>
            */}
            {isLoaded && isSignedIn && (
              <Link href="/mis-votos" className="text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Mis Votos
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            {isLoaded && (
              <div className="flex items-center px-5">
                {isSignedIn ? (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium text-white">{user.firstName || user.username || 'Usuario'}</div>
                        <div className="text-sm font-medium text-blue-200">{user.primaryEmailAddress?.emailAddress}</div>
                      </div>
                    </div>
                    <UserButton 
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          userButtonAvatarBox: "w-8 h-8"
                        }
                      }}
                    />
                  </div>
                ) : (
                  <SignInButton mode="modal">
                    <button className="w-full bg-white text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      Iniciar Sesión
                    </button>
                  </SignInButton>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
