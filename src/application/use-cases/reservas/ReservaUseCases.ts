import type { Reserva, ReservaInput } from '../../../domain/entities/Reserva';
import type { ReservaRepository } from '../../../domain/ports/ReservaRepository';
import { CrudUseCases } from '../common/CrudUseCases';

export class ReservaUseCases extends CrudUseCases<Reserva, ReservaInput> {
  private readonly reservaRepository: ReservaRepository;

  constructor(reservaRepository: ReservaRepository) {
    super(reservaRepository);
    this.reservaRepository = reservaRepository;
  }

  cancelar(id: number): Promise<void> {
    return this.reservaRepository.cancelar(id);
  }
}
