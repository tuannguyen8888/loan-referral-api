import { Inject, Injectable, Scope } from "@nestjs/common";
import { BaseService } from "../../../common/services";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { Logger } from "../../../common/loggers";
import { RedisClient } from "../../../common/shared";
import { RequestUtil } from "../../../common/utils";
import {
  PtfMasterDataRepository,
  PtfProductRepository
} from "../../../repositories";
import { Equal, In, IsNull, Like } from "typeorm";
import { PtfProduct } from "../../../entities";
import * as moment from "moment";
import { MasterDataDto, ProductDto } from "./dto";
import { BankBranchDto } from "./dto/bank-branch.dto";
import { LoanStatusDto } from "./dto/loan-status.dto";

@Injectable({ scope: Scope.REQUEST })
export class PtfMasterDataService extends BaseService {
  constructor(
    @Inject(REQUEST) protected request: Request,
    protected readonly logger: Logger,
    protected readonly redisClient: RedisClient,
    private readonly requestUtil: RequestUtil
  ) {
    super(request, logger, redisClient);
  }

  async getAllProducts(keyWord: string) {
    try {
      const repo = this.connection.getCustomRepository(PtfProductRepository);
      const where: any = {
        //deletedAt: IsNull()
      };
      if (keyWord) {
        where.name = Like(`%${keyWord}%`);
      }
      const options = {
        where: where
      };
      const data = await repo.find(options);
      const result: ProductDto[] = this.convertEntities2Dtos(
        data,
        PtfProduct,
        ProductDto
      );
      return result;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  async getMasterDatas(
    type: string,
    parent1_key: string = null,
    parent2_key: string = null,
    keyWord: string
  ) {
    try {
      const repo = this.connection.getCustomRepository(PtfMasterDataRepository);
      const where: any = {
        //deletedAt: IsNull(),
        type: type
      };
      if (parent1_key) where.parent1Key = parent1_key;
      if (parent2_key) where.parent2Key = parent2_key;
      if (keyWord) {
        where.value = Like(`%${keyWord}%`);
      }
      const options = {
        where: where
      };
      const data = await repo.find(options);
      const result: MasterDataDto[] = this.convertMasterDatas2Dtos(data);
      return result;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  async getBankBranches(
    parent1_key: string = null,
    parent2_key: string = null,
    keyWord: string
  ) {
    try {
      const repo = this.connection.getCustomRepository(PtfMasterDataRepository);
      const where: any = {
        //deletedAt: IsNull(),
        type: "BANK_BRANCH"
      };
      if (parent1_key) where.parent1Key = parent1_key;
      if (parent2_key) where.parent2Key = parent2_key;
      if (keyWord) {
        where.value = Like(`%${keyWord}%`);
      }
      const options = {
        where: where
      };
      const data = await repo.find(options);
      const result: BankBranchDto[] = this.convertMasterDatas2Dtos(
        data,
        BankBranchDto
      );
      return result;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  async getLoanStatus(keyWord: string) {
    try {
      const repo = this.connection.getCustomRepository(PtfMasterDataRepository);
      const where: any = {
        //deletedAt: IsNull(),
        type: "LOAN_STATUS"
      };
      if (keyWord) {
        where.value = Like(`%${keyWord}%`);
      }
      const options = {
        where: where
      };
      const data = await repo.find(options);
      const result: LoanStatusDto[] = this.convertMasterDatas2Dtos(
        data,
        LoanStatusDto
      );
      return result;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  private convertEntity2Dto(entity, entityClass, dtoClass) {
    let dto = new dtoClass();
    let dtoKeys = Object.getOwnPropertyNames(dto);
    let entityKeys = this.connection
      .getMetadata(entityClass)
      .ownColumns.map(column => column.propertyName); // Object.getOwnPropertyNames(entity);
    for (let dtoKey of dtoKeys) {
      for (let entityKey of entityKeys) {
        if (
          dtoKey
            .toLowerCase()
            .split("_")
            .join("") ==
            entityKey
              .toLowerCase()
              .split("_")
              .join("") ||
          dtoKey
            .toLowerCase()
            .split("_")
            .join("") ==
            "in" +
              entityKey
                .toLowerCase()
                .split("_")
                .join("")
        ) {
          dto[dtoKey] = entity[entityKey];
          break;
        }
      }
    }
    if (dto.hasOwnProperty("createdAt"))
      dto.createdAt = entity.createdAt
        ? moment(entity.createdAt).format("YYYY-MM-DD HH:mm:ss")
        : null;
    if (dto.hasOwnProperty("updatedAt"))
      dto.updatedAt = entity.updatedAt
        ? moment(entity.updatedAt).format("YYYY-MM-DD HH:mm:ss")
        : null;
    if (dto.hasOwnProperty("deletedAt"))
      dto.deletedAt = entity.deletedAt
        ? moment(entity.deletedAt).format("YYYY-MM-DD HH:mm:ss")
        : null;
    return dto;
  }

  private convertEntities2Dtos(entities, entityClass, dtoClass) {
    let dtos = [];
    if (entities && entities.length) {
      entities.forEach(entity =>
        dtos.push(this.convertEntity2Dto(entity, entityClass, dtoClass))
      );
    }
    return dtos;
  }

  private convertMasterData2Dto(entity, dtoClass = MasterDataDto) {
    let dto = new dtoClass();
    dto.id = Number(entity.key);
    dto.name = entity.value;
    if (dto.hasOwnProperty("code")) dto["code"] = entity.code;
    return dto;
  }

  private convertMasterDatas2Dtos(entities, dtoClass = MasterDataDto) {
    let dtos = [];
    if (entities && entities.length) {
      entities.forEach(entity => dtos.push(this.convertMasterData2Dto(entity, dtoClass)));
    }
    return dtos;
  }

  private convertDto2Entity(dto, entityClass) {
    let entity = new entityClass();
    let entityKeys = this.connection
      .getMetadata(entityClass)
      .ownColumns.map(column => column.propertyName); //Object.getOwnPropertyNames(entityModelObject);
    console.log("entityKeys = ", entityKeys);
    let dtoKeys = Object.getOwnPropertyNames(dto);
    console.log("dtoKeys = ", dtoKeys);
    for (let entityKey of entityKeys) {
      for (let dtoKey of dtoKeys) {
        if (
          dtoKey
            .toLowerCase()
            .split("_")
            .join("") ==
            entityKey
              .toLowerCase()
              .split("_")
              .join("") ||
          dtoKey
            .toLowerCase()
            .split("_")
            .join("") ==
            "in" +
              entityKey
                .toLowerCase()
                .split("_")
                .join("")
        ) {
          entity[entityKey] = dto[dtoKey];
          break;
        }
      }
    }
    if (dto.hasOwnProperty("createdAt"))
      entity.createdAt = dto.createdAt ? new Date(dto.createdAt) : null;
    if (dto.hasOwnProperty("updatedAt"))
      entity.updatedAt = dto.updatedAt ? new Date(dto.updatedAt) : null;
    if (dto.hasOwnProperty("deletedAt"))
      entity.deletedAt = dto.deletedAt ? new Date(dto.deletedAt) : null;
    return entity;
  }

  private convertDtos2Entities(dtos, entityClass) {
    let entities = [];
    if (dtos && dtos.length) {
      dtos.forEach(dto =>
        entities.push(this.convertDto2Entity(dto, entityClass))
      );
    }
    return entities;
  }
}
