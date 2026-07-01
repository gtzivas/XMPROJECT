import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { STATUS_CODES } from 'http';
import { Response } from 'express';
import { ErrorResponseDto } from '../dto/error-response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const body: ErrorResponseDto = {
      error: STATUS_CODES[status] ?? 'Error',
      message: this.resolveMessage(exception, status),
      status,
    };

    response.status(status).json(body);
  }

  private resolveMessage(exception: unknown, status: number): string {
    if (exception instanceof HttpException) {
      const payload = exception.getResponse();

      if (typeof payload === 'string') {
        return payload;
      }

      if (typeof payload === 'object' && payload !== null) {
        const message = (payload as { message?: string | string[] }).message;

        if (Array.isArray(message)) {
          return message.join(', ');
        }

        if (typeof message === 'string') {
          return message;
        }
      }

      return exception.message;
    }

    return STATUS_CODES[status] ?? 'Internal Server Error';
  }
}
