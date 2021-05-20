import { BadRequestException, Inject, Injectable, Scope } from "@nestjs/common";
import { BaseService } from "../../common/services";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { Logger } from "../../common/loggers";
import { RedisClient } from "../../common/shared";
import { RequestUtil } from "../../common/utils";
import {
  AddressDto,
  GetLoanProfilesRequestDto,
  LoanProfileDto,
  LoanProfilesResponseDto
} from "../mafc/loan-profile/dto";
import {
  AddressRepository,
  LoanProfileRepository,
  ReferenceRepository,
  SaleGroupRepository
} from "../../repositories";
import { Equal, IsNull, Like } from "typeorm";
import { Address, LoanProfile, Reference, SaleGroup } from "../../entities";
import { SaleGroupDto } from "./dto";
import * as moment from "moment";
import { ReferenceDto } from "../mafc/loan-profile/dto/reference.dto";

@Injectable({ scope: Scope.DEFAULT })
export class SaleGroupService extends BaseService {
  constructor(
    @Inject(REQUEST) protected request: Request,
    protected readonly logger: Logger,
    protected readonly redisClient: RedisClient
  ) {
    super(request, logger, redisClient);
  }

  async getAllSaleGroupTree() {
    try {
      console.log("getAllSaleGroupTree");
      const repo = this.connection.getCustomRepository(SaleGroupRepository);
      const where = {
        deletedAt: IsNull()
      };
      const options = {
        where: where
      };
      const data = await repo.find(options);
      let result: SaleGroupDto[] = [];
      if (data && data.length) {
        data.forEach(item => {
          let lp = this.convertEntity2Dto(item, SaleGroup, SaleGroupDto);
          result.push(lp);
        });
      }
      console.log("result = ", result);
      return result;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async addNewSaleGroup(dto: SaleGroupDto) {
    let entity: SaleGroup = this.convertDto2Entity(dto, SaleGroup);
    entity.createdAt = new Date();
    let result = await this.connection
      .getCustomRepository(SaleGroupRepository)
      .save(entity);
    this.logger.verbose(`insertResult = ${result}`);
    let parent;
    if (result.parent) {
      parent = await this.connection
        .getCustomRepository(SaleGroupRepository)
        .findOne({ where: { id: result.parent } });
    }
    if (parent) {
      result.treePath = parent.treePath + "." + result.id;
    } else {
      result.treePath = "" + result.id;
    }
    result = await this.connection
      .getCustomRepository(SaleGroupRepository)
      .save(result);
    let response: LoanProfileDto = this.convertEntity2Dto(
      result,
      SaleGroup,
      SaleGroupDto
    );

    return response;
  }
  async updateParrentSaleGroup(dto: SaleGroupDto) {
    let entity = this.convertDto2Entity(dto, SaleGroup);
    this.logger.verbose(`entity = ${entity}`);
    let result = await this.connection
      .getCustomRepository(SaleGroupRepository)
      .save(entity);
    this.logger.verbose(`updateResult = ${result}`);
    let response = this.convertEntity2Dto(result, SaleGroup, SaleGroupDto);
    return response;
  }

  async deleteSaleGroup(id: number, userId) {
    let repo = this.connection.getCustomRepository(SaleGroupRepository);
    let entity = await repo.findOne(id);
    if (entity) {
      let entities = await repo.find({
        where: {
          deletedAt: IsNull(),
          treePath: Like(entity.treePath + "%")
        }
      });
      if (entities && entities.length) {
        entities.forEach(en => {
          en.deletedAt = new Date();
          en.deletedBy = userId;
        });
      }
      await repo.save(entities);
      return true;
    } else {
      return false;
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
    dto.created_at = entity.createdAt
      ? moment(entity.createdAt).format("YYYY-MM-DD HH:mm:ss")
      : null;
    dto.updated_at = entity.updatedAt
      ? moment(entity.updatedAt).format("YYYY-MM-DD HH:mm:ss")
      : null;
    dto.deleted_at = entity.deletedAt
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
    entity.createdAt = dto.created_at ? new Date(dto.created_at) : null;
    entity.updatedAt = dto.updated_at ? new Date(dto.updated_at) : null;
    entity.deletedAt = dto.deleted_at ? new Date(dto.deleted_at) : null;
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
