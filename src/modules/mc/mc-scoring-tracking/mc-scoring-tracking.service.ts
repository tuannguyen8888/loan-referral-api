import { HttpService, Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { Logger } from "../../../common/loggers";
import { RedisClient } from "../../../common/shared";
import { RequestUtil } from "../../../common/utils";
import { BaseService } from "../../../common/services";

import * as moment from "moment";
import { GetMCScoringTrackingRequestDto } from "./dto/get-scoring-tracking.request.dto";
import {
  McScoringTrackingRepository,
  SaleGroupRepository
} from "../../../repositories";
import { McScoringTrackingsResponseDto } from "./dto/mc-scoring-trackings.response.dto";
import { McScoringTracking } from "../../../entities";
import { McScoringTrackingResponseDto } from "./dto/mc-scoring-tracking.response.dto";
import { McScoringTrackingDto } from "./dto/mc-scoring-tracking.dto";
import { McScoringTrackingUpdateDto } from "./dto/mc-scoring-tracking.update.dto";
import { IsNull, Like } from "typeorm";

@Injectable()
export class McScoringTrackingService extends BaseService {
  constructor(
    @Inject(REQUEST) protected request: Request,
    protected readonly logger: Logger,
    protected readonly redisClient: RedisClient,
    private readonly requestUtil: RequestUtil,
    @Inject(HttpService) private readonly httpService: HttpService
  ) {
    super(request, logger, redisClient);
  }

  async getAllScoringTrackings(dto: GetMCScoringTrackingRequestDto) {
    try {
      const repo = this.connection.getCustomRepository(
        McScoringTrackingRepository
      );
      let query = repo.createQueryBuilder().where("deleted_at is null");

      if (dto.createfrom)
        query = query.andWhere("created_at >= :createfrom", {
          createfrom: dto.createfrom
        });
      if (dto.createto)
        query = query.andWhere("created_at <= :createto", {
          createto: dto.createto + " 23:59:59"
        });
      if (dto.primaryPhone) {
        query = query.andWhere("primaryPhone = :primaryPhone", {
          primaryPhone: dto.primaryPhone
        });
        //query = query.andWhere("verificationCode is null");
      }
      if (dto.user_id) {
        let userGroup = await this.connection
          .getCustomRepository(SaleGroupRepository)
          .findOne({
            where: {
              deletedAt: IsNull(),
              email: dto.user_id
            }
          });
        if (userGroup) {
          let userGroups = await this.connection
            .getCustomRepository(SaleGroupRepository)
            .find({
              where: {
                deletedAt: IsNull(),
                treePath: Like(`${userGroup.treePath}%`)
              }
            });
          let userEmails = [];
          if (userGroups && userGroups.length) {
            userGroups.forEach(ug => userEmails.push(ug.email));
          }
          query = query.andWhere("created_by IN (:...userEmails)", {
            userEmails: userEmails
          });
        } else {
          query = query.andWhere("created_by = :userId", {
            userId: dto.user_id
          });
        }
      }

      if (dto.keyword)
        query = query.andWhere(
          "(productname like :keyword " +
            "OR fullname like :keyword OR " +
            "OR nationalId like :keyword OR " +
            "primaryPhone like :keyword)",
          {
            keyword: "%" + dto.keyword + "%"
          }
        );
      if (dto.sortcol) {
        let sorttype = dto.sorttype ? dto.sorttype : "ASC";
        if (dto.sorttype) {
          if (dto.sorttype == "DESC") {
            query = query.orderBy(dto.sortcol, "DESC");
          } else {
            query = query.orderBy(dto.sortcol, "ASC");
          }
        } else {
          query = query.orderBy(dto.sortcol, "ASC");
        }
      } else {
        query = query.orderBy("id", "DESC");
      }
      if (dto.pagesize != 0) {
        // console.log(dto.pagesize);
        query = query.skip((dto.page - 1) * dto.pagesize).take(dto.pagesize);
      }
      const result = new McScoringTrackingsResponseDto();

      let data, count;
      [data, count] = await query.getManyAndCount();
      result.count = count;
      result.rows = this.convertEntities2Dtos(
        data,
        McScoringTracking,
        McScoringTrackingResponseDto
      );
      return result;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getScoringTracking(id: number) {
    let result = await this.connection
      .getCustomRepository(McScoringTrackingRepository)
      .findOne(id);
    let response: McScoringTrackingResponseDto = this.convertEntity2Dto(
      result,
      McScoringTracking,
      McScoringTrackingResponseDto
    );
    return response;
  }

  async createScoringTracking(dto: McScoringTrackingDto) {
    // console.log(dto);
    let entity: McScoringTracking = this.convertDto2Entity(
      dto,
      McScoringTracking
    );
    entity.createdBy = dto.createdBy;
    entity.createdAt = new Date();
    // console.log(entity);
    this.logger.verbose(`entity = ${JSON.stringify(entity)}`);
    let result = await this.connection
      .getCustomRepository(McScoringTrackingRepository)
      .save(entity);
    this.logger.verbose(`insertResult = ${result}`);
    // console.log(result);
    let response: McScoringTrackingDto = this.convertEntity2Dto(
      result,
      McScoringTracking,
      McScoringTrackingDto
    );
    return response;
  }

  async updateScoringTracking(dto: McScoringTrackingUpdateDto) {
    let entityUpdate: McScoringTracking = this.convertDto2Entity(
      dto,
      McScoringTracking
    );
    entityUpdate.updatedBy = dto.updatedBy;
    entityUpdate.updatedAt = new Date();
    let result = await this.connection
      .getCustomRepository(McScoringTrackingRepository)
      .save(entityUpdate);
    let response: McScoringTrackingUpdateDto = this.convertEntity2Dto(
      result,
      McScoringTracking,
      McScoringTrackingUpdateDto
    );
    return response;
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

  private convertDto2Entity(dto, entityClass) {
    let entity = new entityClass();
    let entityKeys = this.connection
      .getMetadata(entityClass)
      .ownColumns.map(column => column.propertyName); //Object.getOwnPropertyNames(entityModelObject);
    // console.log("entityKeys = ", entityKeys);
    let dtoKeys = Object.getOwnPropertyNames(dto);
    // console.log("dtoKeys = ", dtoKeys);
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
}
