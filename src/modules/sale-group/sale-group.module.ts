import { HttpModule, Module } from "@nestjs/common";
import { Logger } from "../../common/loggers";
import { RedisClient } from "../../common/shared";
import { BaseService } from "../../common/services";
import { SaleGroupController } from "./sale-group.controller";
import { SaleGroupService } from "./sale-group.service";

@Module({
  imports: [HttpModule],
  controllers: [SaleGroupController],
  providers: [Logger, RedisClient, BaseService, SaleGroupService]
})
export class SaleGroupModule {}
