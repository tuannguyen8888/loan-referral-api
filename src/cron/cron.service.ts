import { Injectable, Logger } from "@nestjs/common";
import { MasterDataService } from "../modules/master-data/master-data.service";
import { Cron, SchedulerRegistry, Timeout } from "@nestjs/schedule";

@Injectable()
export class CronService {
  constructor(
    private masterData: MasterDataService,
    private logger: Logger,
    private schedulerRegistry: SchedulerRegistry
  ) {}
  callAPI = [
    this.masterData.mafcFetchBanks(),
    this.masterData.mafcFetchLoanCategory(),
    this.masterData.mafcFetchSaleOffice(),
    this.masterData.mafcFetchSchemes(),
    this.masterData.mafcFetchSecUser(),
    this.masterData.mafcFetchCity(),
    this.masterData.mafcFetchDistrict(),
    this.masterData.mafcFetchWard()
  ];

  @Timeout("mafc-masterdata-once", 0)
  firstCron() {
    console.log(" START THIS ======== ", this.masterData);
    this.logger.debug("Running cronjob first time .........");
    this.handleCron();
  }

  @Cron("* * 0 * * *", {
    name: "mafc-masterdata"
  })
  async handleCron() {
    try {
      this.logger.debug("Starting cronjob .........");
      const getMasterData = await Promise.all(this.callAPI);
      for (let i = 0; i < getMasterData.length; i++) {
        if (!getMasterData[i]) throw new Error("Error when get master data");
      }
    } catch (e) {
      this.logger.debug(e);
      throw new Error(e);
    }
  }
}
