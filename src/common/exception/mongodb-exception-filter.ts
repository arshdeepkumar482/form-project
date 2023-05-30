import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { response } from 'express';
import { MongodbExceptionCodes } from './mongodb-exception-codes';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    console.log('Exception', exception);

    let httpResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Something went wrong, please retry';

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (MongodbExceptionCodes[exception.code]) {
      httpStatus = HttpStatus.BAD_REQUEST;
      httpResponse = {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        message: MongodbExceptionCodes[exception.code](exception, 'email'),
        code: 'duplicate',
      };
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      response:
        typeof httpResponse === 'string'
          ? { message: httpResponse }
          : httpResponse,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
