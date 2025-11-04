export class BotApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ConfigurationError extends BotApiError {}

export class RequestError extends BotApiError {
  public response?: Response;

  constructor(message: string, response?: Response) {
    super(message);
    this.response = response;
  }
}

export class AuthenticationError extends RequestError {}

export class NotFoundError extends RequestError {}

export class RateLimitError extends RequestError {
  public retryAfter: number;

  constructor(message: string, response?: Response, retryAfter: number = 60) {
    super(message, response);
    this.retryAfter = retryAfter;
  }
}

export class ServerError extends RequestError {}
