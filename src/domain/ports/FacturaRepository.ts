import type { Factura, FacturaInput } from '../entities/Factura';
import type { CrudRepository } from './CrudRepository';

export type FacturaRepository = CrudRepository<Factura, FacturaInput>;
