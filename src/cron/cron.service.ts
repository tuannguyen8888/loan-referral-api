import { HttpService, Injectable } from "@nestjs/common";
import { RequestUtil } from "src/common/utils";
import { Logger } from "src/common/loggers";
import { MasterDataService } from "./../modules/master-data/master-data.service";
import { Cron, Timeout } from "@nestjs/schedule";
import { PtfReceiveResultService } from "../modules/ptf/ptf-receive-result/ptf-receive-result.service";

@Injectable()
export class CronService {
  private readonly logger = new Logger();
  private httpService = new HttpService();
  private requestUtil = new RequestUtil(this.httpService);

  @Timeout(0)
  async firstCron() {
    console.info(`RUN ONCE AT ======= ${new Date()}`);
    this.cronService();
    await this.ptfGetLoanStatus();
  }

  @Cron("* * 0 * * *") // chạy mỗi ngày
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

  @Cron("0 0 * * * *") // chạy mỗi giờ
  async ptfCron() {
    console.info(`START CRON PTF AT ======= ${new Date()}`);
    await this.ptfGetLoanStatus();
  }

  async ptfGetLoanStatus() {
    const service = new PtfReceiveResultService(
      null,
      this.logger,
      null,
      this.requestUtil
    );
    await service.getData_loanStatus();
  }
}
