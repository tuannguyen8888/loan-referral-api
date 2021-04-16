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
import {
  BankMasterData,
  CityMasterData,
  DistrictMasterData,
  LoanCategoryMasterData,
  SchemeMasterData,
  SecUserMasterData,
  WardMasterData
} from "src/entities";

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

  bankMD = this.connection.getCustomRepository(BankRepository);
  schemeMD = this.connection.getCustomRepository(SchemeRepository);
  saleMD = this.connection.getCustomRepository(SaleOfficeRepository);
  secMD = this.connection.getCustomRepository(SecUserRepository);
  cityMD = this.connection.getCustomRepository(CityRepository);
  districtMD = this.connection.getCustomRepository(DistrictRepository);
  wardMD = this.connection.getCustomRepository(WardRepository);
  loanCateMD = this.connection.getCustomRepository(LoanCategoryRepository);

  //#region  FIND
  async getBanks() {
    try {
      const repo = await this.bankMD
        .find()
        .then(res => this.convertEntity2DTO(res))
        .catch(e => []);
      return {
        msgName: "getBank",
        data: repo
      };
    } catch (e) {
      throw e;
    }
  }

  async getSchemes() {
    try {
      const repo = await this.schemeMD
        .find()
        .then(res => this.convertEntity2DTO(res))
        .catch(e => []);
      return {
        msgName: "getSchemes",
        data: repo
      };
    } catch (e) {
      throw e;
    }
  }

  async getSaleOffice() {
    try {
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
    } catch (e) {
      throw e;
    }
  }

  async getSecUser() {
    try {
      const repo = await this.secMD
        .find()
        .then(res => this.convertEntity2DTO(res))
        .catch(e => []);
      return {
        msgName: "getSecUser",
        data: repo
      };
    } catch (e) {
      throw e;
    }
  }

  async getCity() {
    try {
      const repo = await this.cityMD
        .find()
        .then(res => this.convertEntity2DTO(res))
        .catch(e => []);
      return {
        msgName: "getCity",
        data: repo
      };
    } catch (e) {
      throw e;
    }
  }

  async getDistrict() {
    try {
      const repo = await this.districtMD
        .find()
        .then(res => this.convertEntity2DTO(res))
        .catch(e => []);
      return {
        msgName: "getDistrict",
        data: repo
      };
    } catch (e) {
      throw e;
    }
  }

  async getWard() {
    try {
      const repo = await this.wardMD
        .find()
        .then(res => this.convertEntity2DTO(res))
        .catch(e => []);
      return {
        msgName: "getWard",
        data: repo
      };
    } catch (e) {
      throw e;
    }
  }

  async getLoanCategory() {
    try {
      const repo = await this.loanCateMD
        .find()
        .then(res => this.convertEntity2DTO(res))
        .catch(e => []);
      return {
        msgName: "getLoanCategory",
        data: repo
      };
    } catch (e) {
      throw e;
    }
  }
  //#endregion

  //#region FETCH AND SAVE
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
    const banks: BankMasterData[] = response.data;
    const res = await this.bankMD.save(banks);
    console.log("SAVED BANK");
    return res;
  }

  async mafcFetchSchemes() {
    let mafc_api_config = config.get("mafc_api");
    const listFilter = [
      "210",
      "211",
      "213",
      "301",
      "302",
      "303",
      "304",
      "305",
      "507",
      "316",
      "317",
      "330",
      "315",
      "314",
      "334",
      "326",
      "331",
      "332",
      "320",
      "321",
      "311",
      "322"
    ];
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
    const schemes: SchemeMasterData[] = response.data.filter(m => {
      const filt = listFilter.some(x => m.schemename.includes(x));
      if (filt) {
        return m;
      }
    });
    const res = await this.schemeMD.save(schemes);
    console.log("SAVED SCHEME");
    return res;
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
    const secusers: SecUserMasterData[] = response.data;
    const res = await this.secMD.save(secusers, { chunk: 500 });
    console.log("SAVED SEC USER");
    return res;
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
    const cities: CityMasterData[] = response.data;
    const res = await this.cityMD.save(cities);
    console.log("SAVED CITY");
    return res;
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
    const districts: DistrictMasterData[] = response.data;
    const res = await this.districtMD.save(districts);
    console.log("SAVED DISTRICT");
    return res;
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
    const wards: WardMasterData[] = response.data;
    const res = await this.wardMD.save([...wards], { chunk: 700 });
    console.log("SAVED WARD");
    return res;
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
    const loanCategories: LoanCategoryMasterData[] = response.data;
    const res = await this.loanCateMD.save(loanCategories);
    console.log("SAVED LOAN CATEGORY");
    return res;
  }

  //#endregion

  convertEntity2DTO(entity) {
    const res = [];
    entity.map(e => {
      const r = {};
      for (const [key, val] of Object.entries(e)) {
        r[key] = val;
      }
      res.push(r);
    });
    return res;
  }

  async cronMasterDataMafc() {
    const success = await Promise.all([
      this.mafcFetchBanks(),
      this.mafcFetchSecUser(),
      this.mafcFetchSchemes(),
      this.mafcFetchLoanCategory(),
      this.mafcFetchCity(),
      this.mafcFetchDistrict(),
      this.mafcFetchWard()
    ]);
    console.log("FETCH AND SAVE MASTER DATA COMPLETED !!!!!")
    return success;
  }
}
