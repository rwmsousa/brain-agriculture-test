import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse<Response>();
          const statusCode = response.statusCode;
          const elapsed = Date.now() - startTime;
          const message = `${method} ${url} ${statusCode} +${elapsed}ms`;

          if (statusCode >= 500) {
            this.logger.error(message);
          } else if (statusCode >= 400) {
            this.logger.warn(message);
          } else {
            this.logger.log(message);
          }
        },
        error: () => {
          const elapsed = Date.now() - startTime;
          this.logger.error(`${method} ${url} ERROR +${elapsed}ms`);
        },
      }),
    );
  }
}
