import { HttpModule, Module } from "@nestjs/common";
import { McCaseNoteController } from "./mc-case-note.controller";
import { McCaseNoteService } from "./mc-case-note.service";
import { Logger } from "../../../common/loggers";
import { RedisClient } from "../../../common/shared";
import { BaseService } from "../../../common/services";
import { RequestUtil } from "../../../common/utils";
import { McapiUtil } from "../../../common/utils/mcapi.util";

@Module({
  imports: [HttpModule],
  controllers: [McCaseNoteController],
  providers: [
    McCaseNoteService,
    Logger,
    RedisClient,
    BaseService,
    McapiUtil,
    RequestUtil
  ]
})
export class McCaseNoteModule {}
