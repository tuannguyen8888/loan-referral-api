import { BankRepository } from "../../repositories/mafc-masterdata/masterdata-bank.repository";
import { Inject, Injectable } from "@nestjs/common";
import { RequestUtil } from "../../common/utils";
import * as config from "config";
import { BaseService } from "../../common/services";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { Logger } from "../../common/loggers";
import { RedisClient } from "../../common/shared";
import {
  CityRepository,
  DistrictRepository,
  LoanCategoryRepository,
  SaleOfficeRepository,
  SchemeRepository,
  SecUserRepository,
  WardRepository
} from "../../repositories";
import { Repository } from "typeorm";

@Injectable()
export class MasterDataService extends BaseService {
  private modelRequest: Repository<any>;

  constructor(
    @Inject(REQUEST) protected request: Request,
    protected readonly logger: Logger,
    protected readonly redisClient: RedisClient,
    private readonly requestUtil: RequestUtil
  ) {
    super(request, logger, redisClient);
  }

  async getBanks() {
    // try {
    //   const repo = this.connection.getCustomRepository(BankRepository).find();
    //   return repo;
    // } catch (e) {
    //   throw e;
    // }

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
    return response;
  }

  async getSchemes() {
    // try {
    //   const repo = this.connection.getCustomRepository(SchemeRepository).find();
    //   return repo;
    // } catch (e) {
    //   throw e;
    // }

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
    return response;
  }

  async getSaleOffice() {
    // try {
    //   const repo = this.connection
    //     .getCustomRepository(SaleOfficeRepository)
    //     .find();
    //   return repo;
    // } catch (e) {
    //   throw e;
    // }

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
    return response;
  }

  async getSecUser() {
    // try {
    //   const repo = this.connection
    //     .getCustomRepository(SecUserRepository)
    //     .find();
    //   return repo;
    // } catch (e) {
    //   throw e;
    // }

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
    return response;
  }

  async getCity() {
    // try {
    //   const repo = this.connection.getCustomRepository(CityRepository).find();
    //   return repo;
    // } catch (e) {
    //   throw e;
    // }

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
    return response;
  }

  async getDistrict() {
    // try {
    //   const repo = this.connection
    //     .getCustomRepository(DistrictRepository)
    //     .find();
    //   return repo;
    // } catch (e) {
    //   throw e;
    // }

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
    return response;
  }

  async getWard() {
    // try {
    //   const repo = this.connection.getCustomRepository(WardRepository).find();
    //   return repo;
    // } catch (e) {
    //   throw e;
    // }

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
    return response;
  }

  async getLoanCategory() {
    // try {
    //   const repo = this.connection
    //     .getCustomRepository(LoanCategoryRepository)
    //     .find();
    //   return repo;
    // } catch (e) {
    //   throw e;
    // }

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
    return response;
  }

  //

  async mafcFetchBanks() {
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
    const res = await this.createOrUpdateMasterData(BankRepository, response);
    return response;
  }

  async mafcFetchSchemes() {
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
    const res = await this.createOrUpdateMasterData(SchemeRepository, response);
    return response;
  }

  async mafcFetchSaleOffice() {
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
    const res = await this.createOrUpdateMasterData(
      SaleOfficeRepository,
      response
    );
    return response;
  }

  async mafcFetchSecUser() {
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
    const res = await this.createOrUpdateMasterData(
      SecUserRepository,
      response
    );
    return response;
  }

  async mafcFetchCity() {
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
    const res = await this.createOrUpdateMasterData(CityRepository, response);
    return response;
  }

  async mafcFetchDistrict() {
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
    const res = await this.createOrUpdateMasterData(
      DistrictRepository,
      response
    );
    return response;
  }

  async mafcFetchWard() {
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
    const res = await this.createOrUpdateMasterData(WardRepository, response);
    return response;
  }

  async mafcFetchLoanCategory() {
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
    const res = await this.createOrUpdateMasterData(
      LoanCategoryRepository,
      response
    );
    return response;
  }

  //

  async createOrUpdateMasterData(repo, data) {
    const tableSelect = this.connection.getCustomRepository(repo);
    // @ts-ignore
    await tableSelect.save(data);
  }
}
