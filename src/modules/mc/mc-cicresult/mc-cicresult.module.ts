import { Module, HttpService, HttpModule } from "@nestjs/common";
import { McCicresultController } from "./mc-cicresult.controller";
import { McCicresultService } from "./mc-cicresult.service";
import { Logger } from "../../../common/loggers";
import { RedisClient } from "../../../common/shared";
import { BaseService } from "../../../common/services";
import { RequestUtil } from "../../../common/utils";
import { McapiUtil } from "../../../common/utils/mcapi.util";

@Module({
  imports: [HttpModule],
  controllers: [McCicresultController],
  providers: [
    McCicresultService,
    Logger,
    RedisClient,
    BaseService,
    McapiUtil,
    RequestUtil
  ]
})
export class McCicresultModule {}
