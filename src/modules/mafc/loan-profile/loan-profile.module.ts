import { Module, HttpService, HttpModule } from "@nestjs/common";
import { LoanProfileController } from "./loan-profile.controller";
import { LoanProfileService } from "./loan-profile.service";
import { Logger } from "../../../common/loggers/index";
import { RedisClient } from "../../../common/shared/index";
import { BaseService } from "../../../common/services/index";
import { RequestUtil } from "src/common/utils/index";

@Module({
  imports: [HttpModule],
  controllers: [LoanProfileController],
  providers: [Logger, RedisClient, BaseService, LoanProfileService, RequestUtil]
})
export class LoanProfileModule {}
