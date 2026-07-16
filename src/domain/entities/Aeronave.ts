export interface Aeronave {
  id: number;
  matricula: string;
  modelo: string;
  capacidad: number;
}

export type AeronaveInput = Omit<Aeronave, 'id'>;
