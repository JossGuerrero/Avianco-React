import type { Vuelo } from '../../../domain/entities/Vuelo';
import type { EstadoVuelo } from '../../../domain/enums/EstadoVuelo';
import type { VueloRepository } from '../../../domain/ports/VueloRepository';

export class GetVuelosUseCase {
  private readonly vueloRepository: VueloRepository;

  constructor(vueloRepository: VueloRepository) {
    this.vueloRepository = vueloRepository;
  }

  execute(estado?: EstadoVuelo): Promise<Vuelo[]> {
    return this.vueloRepository.getVuelos(estado);
  }
}
