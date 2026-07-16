export type QueryParams = Record<string, string | number | boolean>;

// Página de resultados según la paginación estándar de DRF.
export interface Page<T> {
  items: T[];
  count: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Contrato genérico para los recursos CRUD estándar de la API (DRF).
export interface CrudRepository<T, TInput> {
  list(params?: QueryParams): Promise<T[]>;
  listPage(params?: QueryParams): Promise<Page<T>>;
  getById(id: number): Promise<T>;
  create(input: TInput): Promise<T>;
  update(id: number, input: Partial<TInput>): Promise<T>;
  remove(id: number): Promise<void>;
}
