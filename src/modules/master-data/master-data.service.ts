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
      mafc_api_config.url + "/masterdatamci",
      { msgName: "getBank" },
      {
        auth: {
          username: mafc_api_config.username,
          password: mafc_api_config.password
        }
      }
    );
    return response;
  }

  async getSchemes() {
    let mafc_api_config = config.get("mafc_api");
    let response = await this.requestUtil.post(
      mafc_api_config.url + "/masterdatamci",
      { msgName: "getSchemes" },
      {
        auth: {
          username: mafc_api_config.username,
          password: mafc_api_config.password
        }
      }
    );
    return response;
  }

  async getSaleOffice() {
    let mafc_api_config = config.get("mafc_api");
    let response = await this.requestUtil.post(
      mafc_api_config.url + "/masterdatamci",
      { msgName: "getSaleOffice" },
      {
        auth: {
          username: mafc_api_config.username,
          password: mafc_api_config.password
        }
      }
    );
    return response;
  }

  async getSecUser() {
    let mafc_api_config = config.get("mafc_api");
    let response = await this.requestUtil.post(
      mafc_api_config.url + "/masterdatamci",
      { msgName: "getSecUser" },
      {
        auth: {
          username: mafc_api_config.username,
          password: mafc_api_config.password
        }
      }
    );
    return response;
  }

  async getCity() {
    let mafc_api_config = config.get("mafc_api");
    let response = await this.requestUtil.post(
      mafc_api_config.url + "/masterdatamci",
      { msgName: "getCity" },
      {
        auth: {
          username: mafc_api_config.username,
          password: mafc_api_config.password
        }
      }
    );
    return response;
  }

  async getDistrict() {
    let mafc_api_config = config.get("mafc_api");
    let response = await this.requestUtil.post(
      mafc_api_config.url + "/masterdatamci",
      { msgName: "getDistrict" },
      {
        auth: {
          username: mafc_api_config.username,
          password: mafc_api_config.password
        }
      }
    );
    return response;
  }

  async getWard() {
    let mafc_api_config = config.get("mafc_api");
    let response = await this.requestUtil.post(
      mafc_api_config.url + "/masterdatamci",
      { msgName: "getWard" },
      {
        auth: {
          username: mafc_api_config.username,
          password: mafc_api_config.password
        }
      }
    );
    return response;
  }

  async getLoanCategory() {
    let mafc_api_config = config.get("mafc_api");
    let response = await this.requestUtil.post(
      mafc_api_config.url + "/masterdatamci",
      { msgName: "getLoanCategory" },
      {
        auth: {
          username: mafc_api_config.username,
          password: mafc_api_config.password
        }
      }
    );
    return response;
  }
}
