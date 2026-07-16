import type { Factura, FacturaInput } from '../../domain/entities/Factura';
import { AxiosCrudRepository } from './axios-crud.repository';

export class AxiosFacturaRepository extends AxiosCrudRepository<Factura, FacturaInput> {
  constructor() {
    super('/facturas/');
  }
}
