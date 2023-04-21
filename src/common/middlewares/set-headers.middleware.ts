import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { v4 as uuid } from "uuid";

@Injectable()
export class SetHeadersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    req.headers["x-Request-id"] = req.header("x-Request-id") || uuid();
    req.headers["x-correlation-id"] = new Date().getTime().toString();

    next();
  }
}
