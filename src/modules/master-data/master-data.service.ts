import { Inject, Injectable } from "@nestjs/common";
import { RequestUtil } from "../../common/utils";
import * as config from "config";
import { BaseService } from "../../common/services";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { Logger } from "../../common/loggers";
import { RedisClient } from "../../common/shared";

@Injectable()
export class MasterDataService extends BaseService {
  constructor(
    @Inject(REQUEST) protected request: Request,
    protected readonly logger: Logger,
    protected readonly redisClient: RedisClient,
    private readonly requestUtil: RequestUtil
  ) {
    super(request, logger, redisClient);
  }

  async getBanks() {
    let mafc_api_config = config.get("mafc_api");
    let response = await this.requestUtil.post(
      mafc_api_config.url + "/finnApi/applicants/getBank",
      {}
    );
    return response;
  }
  async getSchemes() {
    let mafc_api_config = config.get("mafc_api");
    let response = await this.requestUtil.post(
      mafc_api_config.url + "/finnApi/applicants/getSchemes",
      {}
    );
    return response;
  }
  async getSaleOffice() {
    let mafc_api_config = config.get("mafc_api");
    let response = await this.requestUtil.post(
      mafc_api_config.url + "/finnApi/applicants/getSaleOffice",
      {}
    );
    return response;
  }
  async getSecUser() {
    let mafc_api_config = config.get("mafc_api");
    let response = await this.requestUtil.post(
      mafc_api_config.url + "/finnApi/applicants/getSecUser",
      {}
    );
    return response;
  }
  async getCity() {
    let mafc_api_config = config.get("mafc_api");
    let response = await this.requestUtil.post(
      mafc_api_config.url + "/finnApi/applicants/getCity",
      {}
    );
    return response;
  }
  async getDistrict() {
    let mafc_api_config = config.get("mafc_api");
    let response = await this.requestUtil.post(
      mafc_api_config.url + "/finnApi/applicants/getDistrict",
      {}
    );
    return response;
  }
  async getWard() {
    let mafc_api_config = config.get("mafc_api");
    let response = await this.requestUtil.post(
      mafc_api_config.url + "/finnApi/applicants/getWard",
      {}
    );
    return response;
  }
  async getLoanCategory() {
    let mafc_api_config = config.get("mafc_api");
    let response = await this.requestUtil.post(
      mafc_api_config.url + "/finnApi/applicants/getLoanCategory",
      {}
    );
    return response;
  }
}
