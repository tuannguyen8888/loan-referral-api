import { Module, HttpModule } from "@nestjs/common";
import { McKiosController } from "./mc-kios.controller";
import { McKiosService } from "./mc-kios.service";
import { Logger } from "../../../common/loggers";
import { RedisClient } from "../../../common/shared";
import { BaseService } from "../../../common/services";
import { RequestUtil } from "../../../common/utils";

@Module({
  imports: [HttpModule],
  controllers: [McKiosController],
  providers: [Logger, RedisClient, BaseService, RequestUtil, McKiosService]
})
export class McKiosModule {}
