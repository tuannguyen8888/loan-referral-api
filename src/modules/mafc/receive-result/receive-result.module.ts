import { HttpModule, Module } from "@nestjs/common";
import { ReceiveResultController } from "./receive-result.controller";
import { ReceiveResultService } from "./receive-result.service";
import { MasterDataService } from "../master-data/master-data.service";
import { RequestUtil } from "../../../common/utils/index";
import { Logger } from "../../../common/loggers/index";
import { RedisClient } from "../../../common/shared/index";
import { BaseService } from "../../../common/services/index";

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
