import type { Vuelo, VueloInput } from '../../domain/entities/Vuelo';
import type { EstadoVuelo } from '../../domain/enums/EstadoVuelo';
import type { VueloRepository } from '../../domain/ports/VueloRepository';
import { AxiosCrudRepository } from './axios-crud.repository';
import { axiosClient } from '../http/axios-client';
import { parseApiError } from '../http/api-error';

export class AxiosVueloRepository
  extends AxiosCrudRepository<Vuelo, VueloInput>
  implements VueloRepository
{
  constructor() {
    super('/vuelos/');
  }

  getVuelos(estado?: EstadoVuelo): Promise<Vuelo[]> {
    return this.list(estado ? { estado } : undefined);
  }

  async cancelar(id: number): Promise<void> {
    try {
      await axiosClient.post(`/vuelos/${id}/cancelar/`);
    } catch (error) {
      throw parseApiError(error, 'No se pudo cancelar el vuelo');
    }
  }
}
