import {HttpModule, Module} from '@nestjs/common';
import {PartnerLoanProfileController} from './partner-loan-profile.controller';
import {PartnerLoanProfileService} from './partner-loan-profile.service';
import {Logger} from "../../../common/loggers";
import {RedisClient} from "../../../common/shared";
import {BaseService} from "../../../common/services";
import {RequestUtil} from "../../../common/utils";

@Module({
    imports: [HttpModule],
    controllers: [PartnerLoanProfileController],
    providers: [
        PartnerLoanProfileService,
        Logger,
        RedisClient,
        BaseService, RequestUtil]
})
export class PartnerLoanProfileModule {
}
