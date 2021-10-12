import { Module, HttpService, HttpModule } from "@nestjs/common";
import { McLoanProfileController } from "./mc-loan-profile.controller";
import { McLoanProfileService } from "./mc-loan-profile.service";
import { Logger } from "../../../common/loggers";
import { RedisClient } from "../../../common/shared";
import { BaseService } from "../../../common/services";
import { RequestUtil } from "../../../common/utils";

@Module({
  imports: [HttpModule],
  controllers: [McLoanProfileController],
  providers: [
    Logger,
    RedisClient,
    BaseService,
    McLoanProfileService,
    RequestUtil
  ]
})
export class McLoanProfileModule {}
