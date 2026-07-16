import type { TipoServicio } from '../enums/TipoServicio';

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number | string;
  tipo: TipoServicio;
}

export interface ServicioInput {
  nombre: string;
  descripcion: string;
  precio: number;
  tipo: TipoServicio;
}
