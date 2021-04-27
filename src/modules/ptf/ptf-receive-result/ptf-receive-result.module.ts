import {HttpModule, Module} from '@nestjs/common';
import { PtfReceiveResultController } from './ptf-receive-result.controller';
import { PtfReceiveResultService } from './ptf-receive-result.service';
import {Logger} from "../../../common/loggers";
import {RedisClient} from "../../../common/shared";
import {BaseService} from "../../../common/services";
import {LoanProfileService} from "../../loan-profile/loan-profile.service";
import {RequestUtil} from "../../../common/utils";

@Module({
  imports: [HttpModule],
  controllers: [PtfReceiveResultController],
  providers: [Logger, RedisClient, BaseService, PtfReceiveResultService, RequestUtil]
})
export class PtfReceiveResultModule {}
