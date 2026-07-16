export interface Aerolinea {
  id: number;
  nombre: string;
  codigo: string;
  pais: string;
  sitio_web: string;
}

export type AerolineaInput = Omit<Aerolinea, 'id'>;
