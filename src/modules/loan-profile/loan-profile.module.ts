import { Module, HttpService, HttpModule } from "@nestjs/common";
import { LoanProfileController } from "./loan-profile.controller";
import { LoanProfileService } from "./loan-profile.service";
import { Logger } from "../../common/loggers";
import { RedisClient } from "../../common/shared";
import { BaseService } from "../../common/services";
import { RequestUtil } from "src/common/utils";

@Module({
  imports: [HttpModule],
  controllers: [LoanProfileController],
  providers: [Logger, RedisClient, BaseService, LoanProfileService, RequestUtil]
})
export class LoanProfileModule {}
