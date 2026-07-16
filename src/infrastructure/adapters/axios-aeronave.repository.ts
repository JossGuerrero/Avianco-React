import type { Aeronave, AeronaveInput } from '../../domain/entities/Aeronave';
import { AxiosCrudRepository } from './axios-crud.repository';

export class AxiosAeronaveRepository extends AxiosCrudRepository<Aeronave, AeronaveInput> {
  constructor() {
    super('/aeronaves/');
  }
}
