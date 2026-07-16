import type { Aeropuerto, AeropuertoInput } from '../entities/Aeropuerto';
import type { CrudRepository } from './CrudRepository';

export type AeropuertoRepository = CrudRepository<Aeropuerto, AeropuertoInput>;
