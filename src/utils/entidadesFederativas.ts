/**
 * Lista de entidades federativas de México con sus IDs correspondientes
 */
export interface EntidadFederativa {
  id: number;
  nombre: string;
}

export const ENTIDADES_FEDERATIVAS: EntidadFederativa[] = [
  { id: 0, nombre: 'Aguascalientes' },
  { id: 1, nombre: 'Baja California' },
  { id: 2, nombre: 'Baja California Sur' },
  { id: 3, nombre: 'Campeche' },
  { id: 4, nombre: 'Coahuila' },
  { id: 5, nombre: 'Colima' },
  { id: 6, nombre: 'Chiapas' },
  { id: 7, nombre: 'Chihuahua' },
  { id: 8, nombre: 'Ciudad de México' },
  { id: 9, nombre: 'Durango' },
  { id: 10, nombre: 'Guanajuato' },
  { id: 11, nombre: 'Guerrero' },
  { id: 12, nombre: 'Hidalgo' },
  { id: 13, nombre: 'Jalisco' },
  { id: 14, nombre: 'México' },
  { id: 15, nombre: 'Michoacán' },
  { id: 16, nombre: 'Morelos' },
  { id: 17, nombre: 'Nayarit' },
  { id: 18, nombre: 'Nuevo León' },
  { id: 19, nombre: 'Oaxaca' },
  { id: 20, nombre: 'Puebla' },
  { id: 21, nombre: 'Querétaro' },
  { id: 22, nombre: 'Quintana Roo' },
  { id: 23, nombre: 'San Luis Potosí' },
  { id: 24, nombre: 'Sinaloa' },
  { id: 25, nombre: 'Sonora' },
  { id: 26, nombre: 'Tabasco' },
  { id: 27, nombre: 'Tamaulipas' },
  { id: 28, nombre: 'Tlaxcala' },
  { id: 29, nombre: 'Veracruz' },
  { id: 30, nombre: 'Yucatán' },
  { id: 31, nombre: 'Zacatecas' }
];

/**
 * Obtiene una entidad federativa por su ID
 */
export function getEntidadById(id: number): EntidadFederativa | undefined {
  return ENTIDADES_FEDERATIVAS.find(entidad => entidad.id === id);
}

/**
 * Obtiene una entidad federativa por su nombre (búsqueda parcial insensible a mayúsculas/minúsculas)
 */
export function getEntidadByNombre(nombre: string): EntidadFederativa | undefined {
  const nombreNormalizado = nombre.trim().toLowerCase();
  return ENTIDADES_FEDERATIVAS.find(
    entidad => entidad.nombre.toLowerCase().includes(nombreNormalizado)
  );
}
