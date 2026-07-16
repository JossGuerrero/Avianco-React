import type { Pago, PagoInput } from '../../domain/entities/Pago';
import { AxiosCrudRepository } from './axios-crud.repository';

export class AxiosPagoRepository extends AxiosCrudRepository<Pago, PagoInput> {
  constructor() {
    super('/pagos/');
  }
}
