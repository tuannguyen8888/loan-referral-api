import { HttpModule, Module } from "@nestjs/common";
import { MasterDataController } from "./master-data.controller";
import { MasterDataService } from "./master-data.service";
import { Logger } from "../../../common/loggers/index";
import { RedisClient } from "../../../common/shared/index";
import { BaseService } from "../../../common/services/index";
import { LoanProfileService } from "../loan-profile/loan-profile.service";
import { RequestUtil } from "../../../common/utils/index";

@Module({
  imports: [HttpModule],
  controllers: [MasterDataController],
  providers: [Logger, RedisClient, BaseService, MasterDataService, RequestUtil]
})
export class MasterDataModule {}
