export interface Puerta {
  id: number;
  terminal: number;
  codigo: string;
  activa: boolean;
}

export type PuertaInput = Omit<Puerta, 'id'>;
