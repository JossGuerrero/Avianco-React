import type { Promocion, PromocionInput } from '../../domain/entities/Promocion';
import type { PromocionRepository } from '../../domain/ports/PromocionRepository';
import { AxiosCrudRepository } from './axios-crud.repository';

export class AxiosPromocionRepository
  extends AxiosCrudRepository<Promocion, PromocionInput>
  implements PromocionRepository
{
  constructor() {
    super('/promociones/');
  }

  getPromociones(soloActivas = true): Promise<Promocion[]> {
    return this.list(soloActivas ? { activa: true } : undefined);
  }
}
