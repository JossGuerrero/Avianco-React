import type { TipoEquipaje } from '../enums/TipoEquipaje';

export interface Equipaje {
  id: number;
  reserva: number;
  tipo: TipoEquipaje;
  peso_kg: number | string;
  descripcion: string;
}

export interface EquipajeInput {
  reserva: number;
  tipo: TipoEquipaje;
  peso_kg: number;
  descripcion: string;
}
