import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { Response } from "express";
import { Logger } from "src/common/loggers";

@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<Response>();
    const message = exception.message;

    this.logger.error(
      `Request - URL: ${request.url} - Headers: ${JSON.stringify(
        request.headers
      )} Params: ${JSON.stringify(request.params)} - Query: ${JSON.stringify(
        request.query
      )} - Body: ${JSON.stringify(request.body)} - Response: ${JSON.stringify({
        result: 500,
        message,
        error_id: request.headers["x-correlation-id"]
      })}`
    );
    if (exception && exception.stack) {
      this.logger.error("error stack = " + exception.stack);
    }
    response.status(500).json({
      result: 500,
      message: "Server error",
      error_id: request.headers["x-correlation-id"]
    });
  }
}
