import {HttpService, Injectable} from "@nestjs/common";
import {RequestUtil} from "src/common/utils";
import {Logger} from "src/common/loggers";
import {MasterDataService} from "../modules/mafc/master-data/master-data.service";
import {Cron, Timeout} from "@nestjs/schedule";
import {PtfReceiveResultService} from "../modules/ptf/ptf-receive-result/ptf-receive-result.service";
import {McLoanProfileService} from "../modules/mc/mc-loan-profile/mc-loan-profile.service";
import {Request} from "express";
import {RedisClient} from "../common/shared";
import {GetMcCaseRequestDto} from "../modules/mc/mc-loan-profile/dto/get-mc-case.request.dto";

@Injectable()
export class CronService {
    protected request: Request;
    private logger = new Logger();
    protected redisClient: RedisClient;
    private httpService = new HttpService();
    private requestUtil = new RequestUtil(this.httpService);

    // @Timeout(0)
  // async firstCron() {
  //   console.info(`RUN ONCE AT ======= ${new Date()}`);
  //   this.cronService();
  //   await this.ptfGetLoanStatus();
  // }

  @Cron("0 0 0 * * *") // chạy mỗi ngày
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

  @Cron("0 0 * * * *") // chạy mỗi tiếng
  async ptfCron() {
      console.info(`START CRON PTF AT ======= ${new Date()}`);
      await this.ptfGetLoanStatus();
      let mcloanprofileser = new McLoanProfileService(
          this.request,
          this.logger,
          this.redisClient,
          this.requestUtil,
          this.httpService
      );
      let dto = new GetMcCaseRequestDto();
      dto.pageNumber = 1;
      dto.pageSize = 1000;
      dto.status = "PROCESSING";
      mcloanprofileser.getCases(dto);
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
