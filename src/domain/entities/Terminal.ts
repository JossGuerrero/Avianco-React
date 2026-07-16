export interface Terminal {
  id: number;
  aeropuerto: number;
  nombre: string;
  descripcion: string;
}

export type TerminalInput = Omit<Terminal, 'id'>;
