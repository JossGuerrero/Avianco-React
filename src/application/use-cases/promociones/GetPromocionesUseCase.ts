import type { Promocion } from '../../../domain/entities/Promocion';
import type { PromocionRepository } from '../../../domain/ports/PromocionRepository';

export class GetPromocionesUseCase {
  private readonly promocionRepository: PromocionRepository;

  constructor(promocionRepository: PromocionRepository) {
    this.promocionRepository = promocionRepository;
  }

  execute(soloActivas = true): Promise<Promocion[]> {
    return this.promocionRepository.getPromociones(soloActivas);
  }
}
