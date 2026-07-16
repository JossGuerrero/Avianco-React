import type { Pasajero, PasajeroInput } from '../entities/Pasajero';
import type { CrudRepository } from './CrudRepository';

export type PasajeroRepository = CrudRepository<Pasajero, PasajeroInput>;
