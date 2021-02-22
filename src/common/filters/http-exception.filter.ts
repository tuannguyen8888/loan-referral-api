import * as _ from "lodash";
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { Response } from "express";
import { Logger } from "src/common/loggers";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    let exceptionResponse = exception.getResponse();

    if (_.isObject(exceptionResponse) && exceptionResponse["message"]) {
      exceptionResponse = exceptionResponse["message"];
    }

    this.logger.error(
      `Request - URL: ${request.url} - Headers: ${JSON.stringify(
        request.headers
      )} Params: ${JSON.stringify(request.params)} - Query: ${JSON.stringify(
        request.query
      )} - Body: ${JSON.stringify(request.body)} - Response: ${JSON.stringify({
        result: status,
        message: exceptionResponse,
        exception
      })}`
    );

    switch (status) {
      case 14:
        return response.status(HttpStatus.BAD_GATEWAY).json({
          result: HttpStatus.BAD_GATEWAY,
          message: "Server is temporarily unavailable. Please try again later"
        });

      case undefined:
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          result: HttpStatus.INTERNAL_SERVER_ERROR,
          message: "Server error",
          error_id: request.headers["x-correlation-id"]
        });

      default:
        response.status(status).json({
          result: status,
          message: exceptionResponse
        });
    }
  }
}
