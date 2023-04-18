import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { CheckPartnerService } from "../services";
import { Logger } from "../loggers";

@Injectable()
export class CheckPartnerMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: Logger,
    private readonly service: CheckPartnerService
  ) {}

  async use(req: Request, res: Response, next: Function) {
    const apipath = req.originalUrl;
    const body = req.body;
    const tenantCode =
      req.headers["X-PARTNER-CODE"] || req.headers["x-partner-code"];
    const checksum = req.headers["checksum"];

    this.logger.info(
      `CheckTenantMiddleware: ${{ apipath, body, tenantCode, checksum }}`
    );
    let result;
    try {
      result = await this.service.checkPartnerCodeAndChecksum(
        req,
        tenantCode,
        apipath,
        body,
        checksum
      );
    } catch (e) {
      this.logger.error(`checkTenantCodeAndChecksum: ${e}`);
      next(e);
    }
    if (result) {
      next();
    }
  }
}
