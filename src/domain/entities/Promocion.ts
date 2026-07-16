export interface Promocion {
  id: number;
  codigo: string;
  descripcion: string;
  descuento: number | string;
  activa: boolean;
  fecha_inicio: string;
  fecha_fin: string;
}

export type PromocionInput = Omit<Promocion, 'id'>;
