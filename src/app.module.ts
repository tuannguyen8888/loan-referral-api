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
import { LoanProfileModule } from "./modules/loan-profile/loan-profile.module";
import { MasterDataModule } from "./modules/master-data/master-data.module";
import { ReceiveResultModule } from "./modules/receive-result/receive-result.module";
import { SaleGroupController } from './modules/sale-group/sale-group.controller';
import { SaleGroupService } from './modules/sale-group/sale-group.service';

const addonConfig = config.get("addon");
const databaseConfig = config.get("database");
console.log("databaseConfig", databaseConfig);
const imports = [
  RouterModule.forRoutes(ROUTES),
  LoanProfileModule,
  MasterDataModule,
  ReceiveResultModule
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
    SaleGroupService
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
