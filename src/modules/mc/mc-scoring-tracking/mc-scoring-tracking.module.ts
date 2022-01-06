import { HttpModule, Module } from "@nestjs/common";
import { McScoringTrackingController } from "./mc-scoring-tracking.controller";
import { McScoringTrackingService } from "./mc-scoring-tracking.service";
import { Logger } from "../../../common/loggers";
import { RedisClient } from "../../../common/shared";
import { BaseService } from "../../../common/services";
import { RequestUtil } from "../../../common/utils";

@Module({
  imports: [HttpModule],
  controllers: [McScoringTrackingController],
  providers: [
    Logger,
    RedisClient,
    BaseService,
    RequestUtil,
    McScoringTrackingService
  ]
})
export class McScoringTrackingModule {}
