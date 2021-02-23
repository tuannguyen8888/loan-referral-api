import { Module } from "@nestjs/common";
import { LoanProfileController } from "./loan-profile.controller";
import { LoanProfileService } from "./loan-profile.service";
import {Logger} from "../../common/loggers";
import {RedisClient} from "../../common/shared";
import {BaseService} from "../../common/services";

@Module({
  controllers: [LoanProfileController],
  providers: [
      Logger,
      RedisClient,
      BaseService,
      LoanProfileService
  ]
})
export class LoanProfileModule {}
