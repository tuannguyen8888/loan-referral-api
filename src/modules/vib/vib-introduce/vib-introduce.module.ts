import { HttpModule, Module } from "@nestjs/common";
import { VibIntroduceController } from "./vib-introduce.controller";
import { VibIntroduceService } from "./vib-introduce.service";
import { Logger } from "../../../common/loggers";
import { RedisClient } from "../../../common/shared";
import { BaseService } from "../../../common/services";
import { RequestUtil } from "../../../common/utils";

@Module({
  imports: [HttpModule],
  controllers: [VibIntroduceController],
  providers: [
    VibIntroduceService,
    Logger,
    RedisClient,
    BaseService,
    RequestUtil
  ]
})
export class VibIntroduceModule {}
