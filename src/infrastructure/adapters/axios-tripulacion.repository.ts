import type { Tripulante, TripulanteInput } from '../../domain/entities/Tripulante';
import { AxiosCrudRepository } from './axios-crud.repository';

export class AxiosTripulacionRepository extends AxiosCrudRepository<Tripulante, TripulanteInput> {
  constructor() {
    super('/tripulacion/');
  }
}
