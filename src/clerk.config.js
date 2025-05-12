/**
 * Configuración de Clerk para el dominio votaya.org
 * Este archivo debe ser importado en los archivos que usan Clerk
 */
import { esES } from '@clerk/localizations';

export const clerkConfig = {
  authorizedParties: ['https://votaya.org'],
  // Configuraciones específicas de producción
};

/**
 * Configuración de localización en español para Clerk
 * Utilizamos la localización oficial de Clerk para español de España (esES)
 */
export const clerkLocalization = esES;
