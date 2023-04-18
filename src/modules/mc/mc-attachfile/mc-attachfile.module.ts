import { HttpModule, Module } from "@nestjs/common";
import { McAttachfileController } from "./mc-attachfile.controller";
import { McAttachfileService } from "./mc-attachfile.service";
import { Logger } from "../../../common/loggers";
import { RedisClient } from "../../../common/shared";
import { BaseService } from "../../../common/services";
import { RequestUtil } from "../../../common/utils";
import { McapiUtil } from "../../../common/utils/mcapi.util";

@Module({
  imports: [HttpModule],
  controllers: [McAttachfileController],
  providers: [
    McAttachfileService,
    Logger,
    RedisClient,
    BaseService,
    McapiUtil,
    RequestUtil
  ]
})
export class McAttachfileModule {}
