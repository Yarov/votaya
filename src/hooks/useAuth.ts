import { useAuth as useClerkAuth, useUser } from '@clerk/nextjs';
import { useCallback } from 'react';

interface UseAuthReturn {
  // Estados de autenticación
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null | undefined;
  user: any | null;
  
  // Datos del usuario
  userName: string | null;
  userEmail: string | null;
  userImage: string | null;
  
  // Métodos de autenticación
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
  
  // Utilidades
  redirectToSignIn: (redirectUrl?: string) => void;
  requireAuth: (callback?: () => void) => boolean;
}

export function useAuth(): UseAuthReturn {
  const { isLoaded, userId, signOut, getToken } = useClerkAuth();
  const { user, isSignedIn } = useUser();
  
  // Obtener datos del usuario de forma segura
  const userName = user?.firstName 
    ? `${user.firstName} ${user.lastName || ''}`
    : user?.username || null;
    
  const userEmail = user?.primaryEmailAddress?.emailAddress || null;
  const userImage = user?.imageUrl || null;
  
  // Método para redirigir al usuario a la página de inicio de sesión
  const redirectToSignIn = useCallback((redirectUrl?: string) => {
    const baseUrl = window.location.origin;
    const redirect = redirectUrl || window.location.pathname;
    window.location.href = `/sign-in?redirect_url=${encodeURIComponent(baseUrl + redirect)}`;
  }, []);
  
  // Método para verificar si el usuario está autenticado y ejecutar un callback si no lo está
  const requireAuth = useCallback((callback?: () => void): boolean => {
    if (!isLoaded) {
      return false; // Todavía cargando, no podemos determinar
    }
    
    if (!isSignedIn) {
      if (callback) {
        callback();
      } else {
        redirectToSignIn();
      }
      return false;
    }
    
    return true;
  }, [isLoaded, isSignedIn, redirectToSignIn]);
  
  return {
    // Estados de autenticación
    isAuthenticated: !!isSignedIn,
    isLoading: !isLoaded,
    userId,
    user,
    
    // Datos del usuario
    userName,
    userEmail,
    userImage,
    
    // Métodos de autenticación
    signOut,
    getToken,
    
    // Utilidades
    redirectToSignIn,
    requireAuth
  };
}
