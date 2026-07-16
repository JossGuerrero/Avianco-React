import type { Aeronave, AeronaveInput } from '../entities/Aeronave';
import type { CrudRepository } from './CrudRepository';

export type AeronaveRepository = CrudRepository<Aeronave, AeronaveInput>;
