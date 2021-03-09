import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const url = process.env.APP_URL;
    const prefix = process.env.APP_PREFIX;

    if (
      exception instanceof UnauthorizedException ||
      exception instanceof ForbiddenException
    ) {
      if (!request.isAuthenticated()) {
        response.redirect(
          (url + prefix + '/auth/login').replace(/([^:])(\/\/+)/g, '$1/'), // Redirect to login page if user isnt authenticated
        );
      }
    }

    response.status(exception.getStatus()).json(exception.getResponse());
  }
}
