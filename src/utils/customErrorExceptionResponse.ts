import { HttpException, HttpStatus } from '@nestjs/common';

export class customErrorExceptionResponse extends HttpException {
  constructor(
    message?: string,
    statusCode?: number,
    errors?: Record<string, unknown> | null,
  ) {
    super(
      {
        message: message ?? '',
        errors: errors ?? {},
      },
      statusCode ?? HttpStatus.BAD_REQUEST,
    );
  }
}
