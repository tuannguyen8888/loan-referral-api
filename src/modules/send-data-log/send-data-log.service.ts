import { BadRequestException, Inject, Injectable, Scope } from "@nestjs/common";
import { BaseService } from "../../common/services";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { Logger } from "../../common/loggers";
import { RedisClient } from "../../common/shared";
import { RequestUtil } from "../../common/utils";
import { Equal, IsNull, Like } from "typeorm";
import * as moment from "moment";
import { SaleGroupDto } from "../sale-group/dto";
import { SendDataLog } from "../../entities";
import {
  SendDataLogDto,
  SearchSendDataLogDto,
  SendDataLogsResponseDto
} from "./dto";
import { SendDataLogRepository } from "../../repositories";
import { LoanProfilesResponseDto } from "../mafc/loan-profile/dto";

@Injectable({ scope: Scope.DEFAULT })
export class SendDataLogService extends BaseService {
  constructor(
    @Inject(REQUEST) protected request: Request,
    protected readonly logger: Logger,
    protected readonly redisClient: RedisClient
  ) {
    super(request, logger, redisClient);
  }
  async getAllSendDataLog(searchDto: SearchSendDataLogDto) {
    try {
      console.log("getAllSendDataLog");
      const repo = this.connection.getCustomRepository(SendDataLogRepository);
      let query = repo.createQueryBuilder();
      if (searchDto.keyword)
        query = query.andWhere("keyword like :keyword", {
          keyword: "%" + searchDto.keyword + "%"
        });
      if (searchDto.data)
        query = query.andWhere("data like :data", {
          data: "%" + searchDto.data + "%"
        });
      if (searchDto.result)
        query = query.andWhere("result like :result", {
          result: "%" + searchDto.result + "%"
        });
      if (!searchDto.sort) {
        query = query
          .orderBy("id", "DESC")
          .skip((searchDto.page - 1) * searchDto.pagesize)
          .take(searchDto.pagesize);
        // dto.sort = { id: -1 };
      } else {
        query = query
          .orderBy(
            Object.keys(searchDto.sort)[0],
            Object.values(searchDto.sort)[0] == -1 ? "DESC" : "ASC"
          )
          .skip((searchDto.page - 1) * searchDto.pagesize)
          .take(searchDto.pagesize);
      }
      const result = new SendDataLogsResponseDto();
      result.rows = [];
      let data, count;
      [data, count] = await query.getManyAndCount();
      result.count = count;
      if (data && data.length) {
        data.forEach(item => {
          let lp = this.convertEntity2Dto(item, SendDataLog, SendDataLogDto);
          result.rows.push(lp);
        });
      }
      console.log("result = ", result);
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
    dto.created_at = entity.createdAt
      ? moment(entity.createdAt).format("YYYY-MM-DD HH:mm:ss")
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
