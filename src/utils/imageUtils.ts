export const BASE_IMAGE_URL = 'https://candidaturaspoderjudicial.ine.mx/cycc';
export const PLACEHOLDER_IMAGE = '/placeholder-profile.jpg';

/**
 * Formatea una URL de imagen para asegurar que sea válida
 * @param url URL o ruta de la imagen
 * @returns URL formateada
 */
export const formatImageUrl = (url?: string): string => {
  // Si no hay URL, devolver la imagen de marcador de posición
  if (!url) {
    return PLACEHOLDER_IMAGE;
  }
  
  // Si ya es una URL completa, la devolvemos tal cual
  if (url.startsWith('http')) {
    return url;
  }
  
  // Si es una ruta local que empieza con /, es una imagen local
  if (url.startsWith('/') && !url.includes('/media/cycc')) {
    return url;
  }
  
  // Si es una ruta relativa del INE, la concatenamos con la URL base
  return `${BASE_IMAGE_URL}${url.replace('/media/cycc', '')}`;
};
