export interface TipoAvion {
  id: number;
  nombre: string;
  fabricante: string;
  autonomia_km: number;
  descripcion: string;
}

export type TipoAvionInput = Omit<TipoAvion, 'id'>;
