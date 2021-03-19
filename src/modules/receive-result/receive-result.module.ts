import { HttpModule, Module } from "@nestjs/common";
import { ReceiveResultController } from "./receive-result.controller";
import { ReceiveResultService } from "./receive-result.service";
import { MasterDataService } from "../master-data/master-data.service";
import { RequestUtil } from "../../common/utils";
import { Logger } from "../../common/loggers";
import { RedisClient } from "../../common/shared";
import { BaseService } from "../../common/services";

@Module({
  imports: [HttpModule],
  controllers: [ReceiveResultController],
  providers: [
    Logger,
    RedisClient,
    BaseService,
    ReceiveResultService,
    RequestUtil
  ]
})
export class ReceiveResultModule {}
