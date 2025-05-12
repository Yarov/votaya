// Este archivo es un puente para mantener compatibilidad con el código existente
// Importa y re-exporta el modelo de Typegoose
import CandidatoModel, { CandidatoClass } from './CandidatoModel';

// Exportar el modelo como default para mantener compatibilidad
export default CandidatoModel;

// También exportar la clase para quienes quieran usar el tipado
export type Candidato = CandidatoClass;
