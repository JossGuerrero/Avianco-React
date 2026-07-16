export interface Aeropuerto {
  id: number;
  codigo_iata: string;
  nombre: string;
  ciudad: string;
  pais: string;
}

export type AeropuertoInput = Omit<Aeropuerto, 'id'>;
