import { Candidato } from './candidato';

export interface Voto {
  _id: string;
  userId: string;
  candidatoId: string;
  tipoCatalogo: string;
  fecha: string;
  candidato?: Candidato;
}
