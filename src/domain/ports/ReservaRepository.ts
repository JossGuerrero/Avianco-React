import type { Reserva, ReservaInput } from '../entities/Reserva';
import type { CrudRepository } from './CrudRepository';

export interface ReservaRepository extends CrudRepository<Reserva, ReservaInput> {
  cancelar(id: number): Promise<void>;
}
