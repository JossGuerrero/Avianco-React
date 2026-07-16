import type {
  AuthRepository,
  AuthSession,
  LoginCredentials,
} from '../../../domain/ports/AuthRepository';
import { ValidationException } from '../../../domain/exceptions/ApiException';

export class LoginUseCase {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  execute(credentials: LoginCredentials): Promise<AuthSession> {
    if (!credentials.username.trim() || !credentials.password.trim()) {
      throw new ValidationException('Usuario y contraseña son obligatorios');
    }
    return this.authRepository.login(credentials);
  }
}
