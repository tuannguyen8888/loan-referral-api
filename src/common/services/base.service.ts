import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import {
  Connection,
  getConnection,
  getConnectionManager,
  IsNull
} from "typeorm";
import { RedisClient } from "../shared";
import { Logger } from "../loggers";
import { Partner } from "../../entities";
import { PartnerRepository } from "../../repositories";

@Injectable({ scope: Scope.REQUEST })
export class BaseService {
  constructor(
    @Inject(REQUEST) protected request: Request,
    protected readonly logger: Logger,
    protected readonly redisClient: RedisClient
  ) {
      this.connection = getConnectionManager().get("default");
  }

  protected connection: Connection;

  // protected async getConnection(
  //   isGetMasterDB: boolean = false
  // ): Promise<Connection> {
  //   let partnerCode = this.getPartnerCodeFromRequest();
  //   if (!isGetMasterDB && partnerCode) {
  //     let tenantCache = await this.redisClient.get(
  //       "loan_referral_partner_" + partnerCode
  //     );
  //     if (tenantCache) {
  //       let partner: Partner = Object.assign(
  //         new Partner(),
  //         JSON.parse(
  //           await this.redisClient.get("loan_referral_partner_" + partnerCode)
  //         )
  //       );
  //       getConnectionManager().connections.forEach(conn => {
  //         this.logger.info("connection = " + JSON.stringify(conn.options));
  //       });
  //
  //       this.connection = getConnectionManager().get("default");
  //       // this.connection = getConnection(tenant.dbName);
  //       this.logger.info("this.connection = " + this.connection.name);
  //     } else {
  //       let connection = getConnection("default");
  //       let tenant = await connection
  //         .getCustomRepository(PartnerRepository)
  //         .findOne({ where: { code: partnerCode } });
  //       if (tenant) {
  //         await this.redisClient.set(
  //           "loan_referral_partner_" + partnerCode,
  //           JSON.stringify(tenant)
  //         );
  //         this.connection = getConnectionManager().get("default");
  //       } else {
  //         this.connection = getConnection("default");
  //       }
  //       this.logger.info("this.connection = " + this.connection.name);
  //     }
  //   } else {
  //     this.connection = getConnection("default");
  //   }
  //   return this.connection;
  // }
  //
  // protected getPartnerCodeFromRequest() {
  //   let partnerCode =
  //     this.request.headers["X-PARTNER-CODE"] ||
  //     this.request.headers["x-partner-code"];
  //   return partnerCode;
  // }
}
