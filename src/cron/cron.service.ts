import { Injectable, Logger } from "@nestjs/common";
import { MasterDataService } from "../modules/master-data/master-data.service";
import { Cron, Timeout } from "@nestjs/schedule";

@Injectable()
export class CronService {
  constructor(private masterData: MasterDataService, private logger: Logger) {}

  @Timeout("mafc-masterdata-once", 0)
  firstCron() {
    this.logger.debug("Running cronjob first time .........");
    this.handleCron();
  }

  @Cron("* * 0 * * *", {
    name: "mafc-masterdata"
  })
  handleCron() {
    try {
      this.logger.debug("Starting cronjob .........");
      this.masterData.cronMasterDataMafc();
    } catch (e) {
      this.logger.debug(e);
      throw new Error(e);
    }
  }
}
