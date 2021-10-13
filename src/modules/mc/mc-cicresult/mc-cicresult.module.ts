import {Module, HttpService, HttpModule} from '@nestjs/common';
import {McCicresultController} from './mc-cicresult.controller';
import {McCicresultService} from './mc-cicresult.service';
import {Logger} from "../../../common/loggers";
import {RedisClient} from "../../../common/shared";
import {BaseService} from "../../../common/services";
import {RequestUtil} from "../../../common/utils";

@Module({
    imports: [HttpModule],
    controllers: [McCicresultController],
    providers: [
        McCicresultService,
        Logger,
        RedisClient,
        BaseService,
        RequestUtil
    ]
})
export class McCicresultModule {

}
