import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ValidationError } from 'class-validator';
import { ResponseModel } from '../response.model';

@Injectable()
export class UnauthorizedInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof UnauthorizedException) {
          const validationError = error.getResponse() as ValidationError;
          if (validationError['error'] === 'Unauthorized') {
            throw new HttpException(
              new ResponseModel(
                false,
                null,
                validationError['message'],
                Array.isArray(validationError['message'])
                  ? validationError['message']
                  : [validationError['message']],
              ),
              HttpStatus.UNAUTHORIZED,
            );
          }
        }
        return throwError(error);
      }),
    );
  }
}
