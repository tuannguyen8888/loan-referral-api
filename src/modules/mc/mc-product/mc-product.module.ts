import { Module, HttpModule } from "@nestjs/common";
import { McProductController } from "./mc-product.controller";
import { McProductService } from "./mc-product.service";
import { Logger } from "../../../common/loggers";
import { RedisClient } from "../../../common/shared";
import { BaseService } from "../../../common/services";
import { RequestUtil } from "../../../common/utils";
import { McapiUtil } from "../../../common/utils/mcapi.util";

@Module({
  imports: [HttpModule],
  controllers: [McProductController],
  providers: [
    Logger,
    RedisClient,
    BaseService,
    RequestUtil,
    McapiUtil,
    McProductService
  ]
})
export class McProductModule {}
