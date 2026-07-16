import type { Pago, PagoInput } from '../entities/Pago';
import type { CrudRepository } from './CrudRepository';

export type PagoRepository = CrudRepository<Pago, PagoInput>;
