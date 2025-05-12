export interface Denuncia {
  titulo: string;
  descripcion: string;
  ubicacion: string;
  fechaIncidente: string;
  evidencia?: File | null;
  candidatoId: string;
}
