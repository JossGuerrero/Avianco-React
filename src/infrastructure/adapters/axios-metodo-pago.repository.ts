import type { MetodoPago, MetodoPagoInput } from '../../domain/entities/MetodoPago';
import { AxiosCrudRepository } from './axios-crud.repository';

export class AxiosMetodoPagoRepository extends AxiosCrudRepository<MetodoPago, MetodoPagoInput> {
  constructor() {
    super('/metodos-pago/');
  }
}
