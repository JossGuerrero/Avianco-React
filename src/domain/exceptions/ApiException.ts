export class ApiException extends Error {
  readonly statusCode: number | null;

  constructor(message: string, statusCode: number | null = null) {
    super(message);
    this.name = 'ApiException';
    this.statusCode = statusCode;
  }
}

export class AuthException extends ApiException {
  constructor(message: string, statusCode: number | null = null) {
    super(message, statusCode);
    this.name = 'AuthException';
  }
}

export class ValidationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationException';
  }
}
