import type { TipoMetodoPago } from '../enums/TipoMetodoPago';

export interface MetodoPago {
  id: number;
  nombre: string;
  tipo: TipoMetodoPago;
  activo: boolean;
}

export type MetodoPagoInput = Omit<MetodoPago, 'id'>;
