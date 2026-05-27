import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const res = exceptionResponse as Record<string, unknown>;
        message = (res['message'] as string) || message;
        error = (res['error'] as string) || exception.name;
      }

      if (statusCode === 422) {
        this.logger.warn(`[${statusCode}] ${message}`);
      } else if (statusCode >= 400 && statusCode < 500) {
        this.logger.warn(`[${statusCode}] ${message}`);
      } else {
        this.logger.error(`[${statusCode}] ${message}`);
      }
    } else {
      const err = exception as Error;
      this.logger.error(`Unexpected error: ${err?.message}`, err?.stack);
    }

    response.status(statusCode).json({ statusCode, message, error });
  }
}
