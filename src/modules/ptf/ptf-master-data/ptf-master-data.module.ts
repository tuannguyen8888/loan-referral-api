import { HttpModule, Module } from "@nestjs/common";
import { PtfMasterDataController } from "./ptf-master-data.controller";
import { PtfMasterDataService } from "./ptf-master-data.service";
import { LoanProfileService } from "../../mafc/loan-profile/loan-profile.service";
import { RequestUtil } from "../../../common/utils";
import { Logger } from "../../../common/loggers";
import { RedisClient } from "../../../common/shared";
import { BaseService } from "../../../common/services";

@Module({
  imports: [HttpModule],
  controllers: [PtfMasterDataController],
  providers: [
    Logger,
    RedisClient,
    BaseService,
    PtfMasterDataService,
    RequestUtil
  ]
})
export class PtfMasterDataModule {}
