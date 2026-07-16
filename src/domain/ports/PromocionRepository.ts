import type { Promocion, PromocionInput } from '../entities/Promocion';
import type { CrudRepository } from './CrudRepository';

export interface PromocionRepository extends CrudRepository<Promocion, PromocionInput> {
  getPromociones(soloActivas?: boolean): Promise<Promocion[]>;
}
