import type { Pasajero, PasajeroInput } from '../../domain/entities/Pasajero';
import { AxiosCrudRepository } from './axios-crud.repository';

export class AxiosPasajeroRepository extends AxiosCrudRepository<Pasajero, PasajeroInput> {
  constructor() {
    super('/pasajeros/');
  }
}
