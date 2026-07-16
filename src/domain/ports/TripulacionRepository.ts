import type { Tripulante, TripulanteInput } from '../entities/Tripulante';
import type { CrudRepository } from './CrudRepository';

export type TripulacionRepository = CrudRepository<Tripulante, TripulanteInput>;
