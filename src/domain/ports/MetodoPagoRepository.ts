import type { MetodoPago, MetodoPagoInput } from '../entities/MetodoPago';
import type { CrudRepository } from './CrudRepository';

export type MetodoPagoRepository = CrudRepository<MetodoPago, MetodoPagoInput>;
