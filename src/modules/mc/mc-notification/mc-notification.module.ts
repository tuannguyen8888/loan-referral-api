import { HttpModule, Module } from "@nestjs/common";
import { McNotificationController } from "./mc-notification.controller";
import { McNotificationService } from "./mc-notification.service";
import { Logger } from "../../../common/loggers";
import { RedisClient } from "../../../common/shared";
import { BaseService } from "../../../common/services";
import { RequestUtil } from "../../../common/utils";
import { McapiUtil } from "../../../common/utils/mcapi.util";

@Module({
  imports: [HttpModule],
  controllers: [McNotificationController],
  providers: [
    McNotificationService,
    Logger,
    RedisClient,
    BaseService,
    McapiUtil,
    RequestUtil
  ]
})
export class McNotificationModule {}
