import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { Response } from "express";
import { getThemeCssPath } from "src/common/helpers";

@Catch(HttpException)
export class PageExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    switch (status) {
      case HttpStatus.NOT_FOUND:
        return response.status(status).render("error", {
          title: "Invalid request",
          themeCss: getThemeCssPath()
        });

      case HttpStatus.REQUEST_TIMEOUT:
        return response.status(status).render("error", {
          title: "Request timed-out",
          themeCss: getThemeCssPath()
        });

      case HttpStatus.INTERNAL_SERVER_ERROR:
        return response.status(status).render("error", {
          title: "Unknown error",
          themeCss: getThemeCssPath()
        });

      default:
        response.status(status).render("error", {
          title: exception.getResponse(),
          themeCss: getThemeCssPath()
        });
    }
  }
}
