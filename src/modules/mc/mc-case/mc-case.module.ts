import {HttpModule, Module} from '@nestjs/common';
import {McCaseController} from './mc-case.controller';
import {McCaseService} from './mc-case.service';
import {Logger} from "../../../common/loggers";
import {RedisClient} from "../../../common/shared";
import {BaseService} from "../../../common/services";
import {RequestUtil} from "../../../common/utils";

@Module({
    imports: [HttpModule],
    controllers: [McCaseController],
    providers: [
        McCaseService,
        Logger,
        RedisClient,
        BaseService,
        RequestUtil
    ]
})
export class McCaseModule {
}
