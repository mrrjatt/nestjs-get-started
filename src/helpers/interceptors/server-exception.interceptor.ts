import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ValidationError } from 'class-validator';
import { ResponseModel } from '../response.model';

@Injectable()
export class ServerErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof InternalServerErrorException) {
          const validationError = error.getResponse() as ValidationError;
          if (validationError['error'] === 'Internal server error') {
            throw new HttpException(
              new ResponseModel(
                false,
                null,
                validationError['message'],
                Array.isArray(validationError['message'])
                  ? validationError['message']
                  : [validationError['message']],
              ),
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
        }
        return throwError(error);
      }),
    );
  }
}
