import { HttpModule, Module } from "@nestjs/common";
import { McApiTrackingController } from "./mc-api-tracking.controller";
import { McApiTrackingService } from "./mc-api-tracking.service";
import { Logger } from "../../../common/loggers";
import { RedisClient } from "../../../common/shared";
import { BaseService } from "../../../common/services";
import { RequestUtil } from "../../../common/utils";

@Module({
  imports: [HttpModule],
  controllers: [McApiTrackingController],
  providers: [
    Logger,
    RedisClient,
    BaseService,
    RequestUtil,
    McApiTrackingService
  ]
})
export class McApiTrackingModule {}
