import type { Vuelo, VueloInput } from '../entities/Vuelo';
import type { EstadoVuelo } from '../enums/EstadoVuelo';
import type { CrudRepository } from './CrudRepository';

export interface VueloRepository extends CrudRepository<Vuelo, VueloInput> {
  getVuelos(estado?: EstadoVuelo): Promise<Vuelo[]>;
  cancelar(id: number): Promise<void>;
}
