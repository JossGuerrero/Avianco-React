export interface Pais {
  id: number;
  nombre: string;
  codigo: string;
  bandera: string;
}

export type PaisInput = Omit<Pais, 'id'>;
