export interface Ciudad {
  id: number;
  nombre: string;
  pais: number;
}

export type CiudadInput = Omit<Ciudad, 'id'>;
