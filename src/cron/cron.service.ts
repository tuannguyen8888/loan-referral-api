import { HttpService, Injectable } from "@nestjs/common";
import { RequestUtil } from "src/common/utils";
import { Logger } from "src/common/loggers";
import { MasterDataService } from "./../modules/master-data/master-data.service";
import { Cron, Timeout } from "@nestjs/schedule";

@Injectable()
export class CronService {
  private readonly logger = new Logger();
  private httpService = new HttpService();
  private requestUtil = new RequestUtil(this.httpService);

  @Timeout(0)
  firstCron() {
    console.info(`RUN ONCE AT ======= ${new Date()}`);
    this.cronService();
  }

  @Cron("* * 0 * * *")
  mafcCron() {
    console.info(`START CRON AT ======= ${new Date()}`);
    this.cronService();
  }

  cronService() {
    const masterData = new MasterDataService(
      null,
      this.logger,
      null,
      this.requestUtil
    );
    masterData.cronMasterDataMafc();
    return;
  }
}
