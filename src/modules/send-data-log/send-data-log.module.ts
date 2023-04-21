import { Module } from "@nestjs/common";
import { SendDataLogController } from "./send-data-log.controller";
import { SendDataLogService } from "./send-data-log.service";
import { Logger } from "../../common/loggers";
import { RedisClient } from "../../common/shared";
import { BaseService } from "../../common/services";

@Module({
  controllers: [SendDataLogController],
  providers: [SendDataLogService, Logger, RedisClient]
})
export class SendDataLogModule {}
