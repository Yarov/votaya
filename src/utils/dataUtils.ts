/**
 * Utilidades para manejar datos y errores en las APIs
 */

/**
 * Verifica si un valor es válido (no es undefined, null, NaN)
 * @param value Valor a verificar
 * @returns true si el valor es válido
 */
export const isValidValue = (value: any): boolean => {
  return value !== undefined && value !== null && (typeof value !== 'number' || !isNaN(value));
};

/**
 * Sanitiza un objeto eliminando propiedades con valores inválidos
 * @param obj Objeto a sanitizar
 * @returns Objeto sanitizado
 */
export const sanitizeObject = <T extends object>(obj: T): Partial<T> => {
  if (!obj || typeof obj !== 'object') {
    return {};
  }

  const result: Partial<T> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      
      if (isValidValue(value)) {
        if (Array.isArray(value)) {
          // Si es un array, filtramos los valores inválidos
          result[key] = value.filter(isValidValue) as any;
        } else if (typeof value === 'object' && value !== null) {
          // Si es un objeto, lo sanitizamos recursivamente
          result[key] = sanitizeObject(value) as any;
        } else {
          // Si es un valor primitivo válido, lo mantenemos
          result[key] = value;
        }
      }
    }
  }

  return result;
};

/**
 * Maneja errores de fetch de APIs externas
 * @param error Error capturado
 * @param url URL de la API
 * @returns Mensaje de error formateado
 */
export const handleFetchError = (error: any, url: string): string => {
  console.error(`Error fetching data from ${url}:`, error);
  return `Error al obtener datos de ${url}: ${error.message || 'Error desconocido'}`;
};

/**
 * Asegura que un campo sea un array, incluso si es un valor único
 * @param value Valor a convertir en array
 * @returns Array asegurado
 */
export const ensureArray = <T>(value: T | T[] | undefined | null): T[] => {
  if (value === undefined || value === null) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
};

/**
 * Convierte un valor a string de manera segura
 * @param value Valor a convertir
 * @returns String o valor por defecto
 */
export const safeString = (value: any, defaultValue: string = ''): string => {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  return String(value);
};
