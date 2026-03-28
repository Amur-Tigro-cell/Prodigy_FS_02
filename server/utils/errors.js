class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

class UnauthorizedError extends ErrorResponse {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

class ConflictError extends ErrorResponse {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

module.exports = {
  ErrorResponse,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
};
