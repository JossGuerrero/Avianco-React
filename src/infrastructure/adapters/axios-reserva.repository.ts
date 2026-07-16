import type { Reserva, ReservaInput } from '../../domain/entities/Reserva';
import type { ReservaRepository } from '../../domain/ports/ReservaRepository';
import { AxiosCrudRepository } from './axios-crud.repository';
import { axiosClient } from '../http/axios-client';
import { parseApiError } from '../http/api-error';

export class AxiosReservaRepository
  extends AxiosCrudRepository<Reserva, ReservaInput>
  implements ReservaRepository
{
  constructor() {
    super('/reservas/');
  }

  async cancelar(id: number): Promise<void> {
    try {
      await axiosClient.post(`/reservas/${id}/cancelar/`);
    } catch (error) {
      throw parseApiError(error, 'No se pudo cancelar la reserva');
    }
  }
}
