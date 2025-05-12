import { prop, getModelForClass, modelOptions, Severity } from '@typegoose/typegoose';
import type { Ref } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import mongoose from 'mongoose';

// Clase principal para la denuncia
@modelOptions({ schemaOptions: { collection: 'denuncias' } })
export class Denuncia extends TimeStamps {
  @prop({ required: true })
  public titulo!: string;

  @prop({ required: true })
  public descripcion!: string;

  @prop({ required: true, ref: () => 'Candidato' })
  public candidatoId!: Ref<any>;

  @prop({ required: true, type: String })
  public userId!: string; // ID del usuario de Clerk

  @prop({ default: 'PENDIENTE' })
  public estado!: string; // Estado de la denuncia

  @prop({ default: false })
  public resuelto!: boolean; // Si la denuncia ha sido resuelta
}

// Exportar el modelo
let denunciaModel;
try {
  denunciaModel = mongoose.model('Denuncia');
} catch (error) {
  denunciaModel = getModelForClass(Denuncia, {
    existingConnection: mongoose.connection,
    options: { allowMixed: Severity.ALLOW }
  });
}

export const DenunciaModel = denunciaModel;
