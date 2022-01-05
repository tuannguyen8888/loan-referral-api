import * as config from "config";
import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod
} from "@nestjs/common";
import { RouterModule } from "nest-router";
import { ROUTES } from "src/app.route";
import {
  SetHeadersMiddleware,
  CheckPartnerMiddleware
} from "./common/middlewares";
import { BaseService, CheckPartnerService } from "src/common/services";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisClient } from "./common/shared";
import { Logger } from "./common/loggers";
import { PartnerRepository } from "./repositories";
import { LoanProfileModule } from "./modules/mafc/loan-profile/loan-profile.module";
import { MasterDataModule } from "./modules/mafc/master-data/master-data.module";
import { ReceiveResultModule } from "./modules/mafc/receive-result/receive-result.module";
import { SaleGroupController } from "./modules/sale-group/sale-group.controller";
import { SaleGroupService } from "./modules/sale-group/sale-group.service";
import { ScheduleModule } from "@nestjs/schedule";
import { CronService } from "./cron/cron.service";
import { PtfLoanProfileModule } from "./modules/ptf/ptf-loan-profile/ptf-loan-profile.module";
import { PtfMasterDataModule } from "./modules/ptf/ptf-master-data/ptf-master-data.module";
import { PtfReceiveResultModule } from "./modules/ptf/ptf-receive-result/ptf-receive-result.module";
import { SendDataLogModule } from "./modules/send-data-log/send-data-log.module";
import { McLoanProfileModule } from "./modules/mc/mc-loan-profile/mc-loan-profile.module";
import { McKiosModule } from "./modules/mc/mc-kios/mc-kios.module";
import { McProductModule } from "./modules/mc/mc-product/mc-product.module";
import { McCicresultModule } from "./modules/mc/mc-cicresult/mc-cicresult.module";
import { McCaseModule } from "./modules/mc/mc-case/mc-case.module";
import { McCaseNoteModule } from "./modules/mc/mc-case-note/mc-case-note.module";
import { McNotificationModule } from "./modules/mc/mc-notification/mc-notification.module";
import { McNotificationResponseDto } from "./modules/mc/mc-notification/dto/mc-notification.response.dto";
import { McAttachfileModule } from "./modules/mc/mc-attachfile/mc-attachfile.module";
import { TtfcLoanProfileModule } from "./modules/ttfc/ttfc-loan-profile/ttfc-loan-profile.module";
import { PartnerLoanProfileModule } from "./modules/partner/partner-loan-profile/partner-loan-profile.module";
import { McScoringTrackingModule } from './modules/mc/mc-scoring-tracking/mc-scoring-tracking.module';

const addonConfig = config.get("addon");
const databaseConfig = config.get("database");
console.log("databaseConfig", databaseConfig);
const imports = [
  RouterModule.forRoutes(ROUTES),
  LoanProfileModule,
  MasterDataModule,
  ReceiveResultModule,
  ScheduleModule.forRoot(),
  PtfLoanProfileModule,
  PtfMasterDataModule,
  PtfReceiveResultModule,
  SendDataLogModule,
  McLoanProfileModule,
  McKiosModule,
  McProductModule,
  McCicresultModule,
  McCaseModule,
  McCaseNoteModule,
  McNotificationModule,
  McAttachfileModule,
  McScoringTrackingModule,
  PartnerLoanProfileModule
];
databaseConfig.forEach(db => {
  imports.push(TypeOrmModule.forRoot(db));
});

@Module({
  imports: imports,
  providers: [
    Logger,
    RedisClient,
    PartnerRepository,
    CheckPartnerService,
    BaseService,
    SaleGroupService,
    CronService
  ],
  controllers: [SaleGroupController]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    if (process.env.NODE_ENV == "development") {
      consumer.apply(SetHeadersMiddleware).forRoutes("*");
    } else {
      consumer
        .apply(SetHeadersMiddleware)
        // .apply(SetHeadersMiddleware, CheckPartnerMiddleware)
        // .exclude(
        //   { path: 'page/checkout', method: RequestMethod.ALL },
        // )
        .forRoutes("*");
    }
  }
}
