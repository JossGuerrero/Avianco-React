import type {
  AuthRepository,
  AuthSession,
  RegisterData,
} from '../../../domain/ports/AuthRepository';
import { ValidationException } from '../../../domain/exceptions/ApiException';

export class RegisterUseCase {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  execute(data: RegisterData): Promise<AuthSession> {
    if (!data.username.trim() || !data.email.trim() || !data.password.trim()) {
      throw new ValidationException('Usuario, email y contraseña son obligatorios');
    }
    if (data.password.length < 6) {
      throw new ValidationException('La contraseña debe tener al menos 6 caracteres');
    }
    return this.authRepository.register(data);
  }
}
