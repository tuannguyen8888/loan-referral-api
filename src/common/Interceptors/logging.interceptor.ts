import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from "@nestjs/common";
import { Observable } from "rxjs";
import { Logger } from "src/common/loggers";

@Injectable()
export class LoggingInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest();

    this.logger.verbose(
      `Request - URL: ${request.url} - Headers: ${JSON.stringify(
        request.headers
      )} Params: ${JSON.stringify(request.params)} - Query: ${JSON.stringify(
        request.query
      )} - Body: ${JSON.stringify(request.body)}`
    );

    return next.handle();
  }
}
