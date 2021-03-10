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
      mafc_api_config.master_data.url,
      { msgName: "getBank" },
      {
        auth: {
          username: mafc_api_config.master_data.username,
          password: mafc_api_config.master_data.password
        }
      }
    );
    return response.data;
  }

  async getSchemes() {
    let mafc_api_config = config.get("mafc_api");
    let response = await this.requestUtil.post(
      mafc_api_config.master_data.url,
      { msgName: "getSchemes" },
      {
        auth: {
          username: mafc_api_config.master_data.username,
          password: mafc_api_config.master_data.password
        }
      }
    );
    return response.data;
  }

  async getSaleOffice() {
    let mafc_api_config = config.get("mafc_api");
    let response = await this.requestUtil.post(
      mafc_api_config.master_data.url,
      { msgName: "getSaleOffice" },
      {
        auth: {
          username: mafc_api_config.master_data.username,
          password: mafc_api_config.master_data.password
        }
      }
    );
    return response.data;
  }

  async getSecUser() {
    let mafc_api_config = config.get("mafc_api");
    let response = await this.requestUtil.post(
      mafc_api_config.master_data.url,
      { msgName: "getSecUser" },
      {
        auth: {
          username: mafc_api_config.master_data.username,
          password: mafc_api_config.master_data.password
        }
      }
    );
    return response.data;
  }

  async getCity() {
    let mafc_api_config = config.get("mafc_api");
    let response = await this.requestUtil.post(
      mafc_api_config.master_data.url,
      { msgName: "getCity" },
      {
        auth: {
          username: mafc_api_config.master_data.username,
          password: mafc_api_config.master_data.password
        }
      }
    );
    return response.data;
  }

  async getDistrict() {
    let mafc_api_config = config.get("mafc_api");
    let response = await this.requestUtil.post(
      mafc_api_config.master_data.url,
      { msgName: "getDistrict" },
      {
        auth: {
          username: mafc_api_config.master_data.username,
          password: mafc_api_config.master_data.password
        }
      }
    );
    return response.data;
  }

  async getWard() {
    let mafc_api_config = config.get("mafc_api");
    let response = await this.requestUtil.post(
      mafc_api_config.master_data.url,
      { msgName: "getWard" },
      {
        auth: {
          username: mafc_api_config.master_data.username,
          password: mafc_api_config.master_data.password
        }
      }
    );
    return response.data;
  }

  async getLoanCategory() {
    let mafc_api_config = config.get("mafc_api");
    let response = await this.requestUtil.post(
      mafc_api_config.master_data.url,
      { msgName: "getLoanCategory" },
      {
        auth: {
          username: mafc_api_config.master_data.username,
          password: mafc_api_config.master_data.password
        }
      }
    );
    return response.data;
  }
}
