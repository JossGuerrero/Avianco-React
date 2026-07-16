import type { Aeropuerto, AeropuertoInput } from '../../domain/entities/Aeropuerto';
import { AxiosCrudRepository } from './axios-crud.repository';

export class AxiosAeropuertoRepository extends AxiosCrudRepository<Aeropuerto, AeropuertoInput> {
  constructor() {
    super('/aeropuertos/');
  }
}
