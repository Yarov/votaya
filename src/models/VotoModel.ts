import { prop, getModelForClass, modelOptions, Severity, Ref } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import mongoose from 'mongoose';
import { logger } from '@/lib/logger';
import { clearModels } from '@/lib/mongodb';

// Verificar si el modelo ya existe antes de definir la clase
let VotoModel: any;

try {
  // Intentar obtener el modelo existente
  VotoModel = mongoose.models.Voto || mongoose.model('Voto');
  logger.info('Using existing Voto model');
} catch (error) {
  logger.info('Creating new Voto model');

  // Definir la clase
  @modelOptions({
    schemaOptions: {
      timestamps: true,
      collection: 'votos'
    },
    options: {
      allowMixed: Severity.ALLOW
    }
  })
  class VotoClass extends TimeStamps {
    @prop({ required: true, validate: /^[0-9a-fA-F]{24}$/ })
    public candidatoId!: string;
    
    @prop({ required: true, validate: /^[0-9a-fA-F]{24}$/ })
    public usuarioId!: string;
    
    @prop({ default: new Date(), required: true })
    public fechaVoto?: Date;
    
    @prop({ default: 1, required: true, min: 1, max: 5 })
    public valor?: number;
  }

  // Crear el modelo usando una función separada
  function createVotoModel() {
    try {
      // Limpiar modelos existentes antes de crear uno nuevo
      clearModels();
      
      // Intentar obtener el modelo existente
      const existingModel = mongoose.models.Voto;
      if (existingModel) {
        logger.info('Returning existing Voto model');
        return existingModel;
      }
      
      // Si no existe, crearlo
      logger.info('Creating new Voto model instance');
      return getModelForClass(VotoClass);
    } catch (error) {
      logger.error('Error creating Voto model:', error);
      throw error;
    }
  }

  // Crear el modelo
  VotoModel = createVotoModel();
}

// Exportar el modelo
export { VotoModel };
