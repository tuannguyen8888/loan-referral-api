import { HttpModule, Module } from "@nestjs/common";
import { PtfLoanProfileController } from "./ptf-loan-profile.controller";
import { PtfLoanProfileService } from "./ptf-loan-profile.service";
import { Logger } from "../../../common/loggers";
import { RedisClient } from "../../../common/shared";
import { BaseService } from "../../../common/services";
import { LoanProfileService } from "../../mafc/loan-profile/loan-profile.service";
import { RequestUtil } from "../../../common/utils";

@Module({
  imports: [HttpModule],
  controllers: [PtfLoanProfileController],
  providers: [
    Logger,
    RedisClient,
    BaseService,
    PtfLoanProfileService,
    RequestUtil
  ]
})
export class PtfLoanProfileModule {}
