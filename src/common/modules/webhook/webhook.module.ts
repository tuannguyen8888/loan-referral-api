import * as config from "config";
import { HttpModule, Module } from "@nestjs/common";
import { Logger } from "src/common/loggers";
import { WebhookUtil } from "src/common/utils";
import { WebhookService } from "./webhook.service";
// import { PartnerRepository } from "src/common/repositories";
// import {MongoDBAddon} from "../../../../../loyalty-addon-mongodb";

const addonConfig = config.get("addon");

@Module({
  imports: [
    // MongoDBAddon.forRoot({
    //     queryUrl: addonConfig.mongodb.queryConnectionString,
    //     mutationUrl: addonConfig.mongodb.mutationConnectionString
    // }),
    HttpModule
  ],
  providers: [Logger, WebhookUtil, WebhookService],
  exports: [WebhookService]
})
export class WebhookModule {}
