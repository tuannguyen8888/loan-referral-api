import { HttpService, Injectable } from "@nestjs/common";
import { RequestUtil } from "src/common/utils";
import { Logger } from "src/common/loggers";
import * as cron from "node-cron";
import { MasterDataService } from "./../modules/master-data/master-data.service";

@Injectable()
export class CronService {
  private readonly logger = new Logger();
  constructor(private mafcService: MasterDataService) {}

  mafcCron() {
    this.mafcService.cronMasterDataMafc();
  }
}

const callCron = () => {
  const httpService = new HttpService();
  const newCron = new CronService(
    new MasterDataService(
      null,
      new Logger(),
      null,
      new RequestUtil(httpService)
    )
  );
  newCron.mafcCron();
};

export const runningOnStart = () => {
  callCron();
  cron.schedule("* * 0 * * *", () => {
    callCron();
  });
};

runningOnStart();
