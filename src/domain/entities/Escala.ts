export interface Escala {
  id: number;
  vuelo: number;
  aeropuerto: number;
  orden: number;
  llegada: string;
  salida: string;
}

export type EscalaInput = Omit<Escala, 'id'>;
