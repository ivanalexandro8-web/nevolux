// src/utils/AppError.js
// Error de negocio controlado (404, 400, 401, 403, etc). Nunca se filtra el error crudo de MySQL.
class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

module.exports = AppError;
