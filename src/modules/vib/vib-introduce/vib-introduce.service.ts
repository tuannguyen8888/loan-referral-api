import { HttpService, Inject, Injectable } from "@nestjs/common";
import { BaseService } from "../../../common/services";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { Logger } from "../../../common/loggers";
import { RedisClient } from "../../../common/shared";
import { RequestUtil } from "../../../common/utils";

import {
  McProductRepository,
  VibIntroduceRepository
} from "../../../repositories";

import {
  McCaseNote,
  McLoanProfile,
  McProduct,
  VIBIntroduceLog
} from "../../../entities";

import { GetVibIntroduceRequestDto } from "./dto/get-introduce.request.dto";
import * as moment from "moment";

import { VibIntroduceDto } from "./dto/vib-introduce.dto";
import { VibIntroduceUpdateDto } from "./dto/vib-introduce.update.dto";
import { VibIntroduceResponseDto } from "./dto/vib-introduce.response.dto";
import { VIBIntroduce } from "../../../entities/vib/vib-introduce-entiy";
import { VibIntroducesResponseDto } from "./dto/vib-introduces.response.dto";
import { VibIntroduceUpdateCommissionDto } from "./dto/vib-introduce.update.commission.dto";
import { VibIntroduceLogDto } from "./dto/vib-introduce-log.dto";
import { VibIntroduceLogRepository } from "../../../repositories/vib/vib-introduce-log.repository";

@Injectable()
export class VibIntroduceService extends BaseService {
  constructor(
    @Inject(REQUEST) protected request: Request,
    protected readonly logger: Logger,
    protected readonly redisClient: RedisClient,
    private readonly requestUtil: RequestUtil,
    @Inject(HttpService) private readonly httpService: HttpService
  ) {
    super(request, logger, redisClient);
  }
  async getAllIntroduces(dto: GetVibIntroduceRequestDto) {
    try {
      const repo = this.connection.getCustomRepository(VibIntroduceRepository);
      let query = repo.createQueryBuilder().where("deleted_at is null");
      if (dto.regisdatefrom) {
        query = query.andWhere("regisdate >= :regisdatefrom", {
          regisdatefrom: dto.regisdatefrom
        });
      }
      if (dto.regisdateto) {
        query = query.andWhere("regisdate <= :regisdateto", {
          regisdateto: dto.regisdateto
        });
      }
      if (dto.source) {
        query = query.andWhere("source = :source", {
          source: dto.source
        });
      }
      if (dto.cardtype) {
        query = query.andWhere("cardtype = :cardtype", {
          cardtype: dto.cardtype
        });
      }
      if (dto.statuslead) {
        query = query.andWhere("statuslead = :statuslead", {
          statuslead: dto.statuslead
        });
      }
      if (dto.statusapproval) {
        query = query.andWhere("statusapproval = :statusapproval", {
          statusapproval: dto.statusapproval
        });
      }
      if (dto.paid) {
        query = query.andWhere("paid = :paid", {
          paid: dto.paid
        });
      }
      if (dto.keyword)
        query = query.andWhere(
          "(source like :keyword " +
            "OR source like :keyword" +
            "OR introduceby like :keyword" +
            "OR customername like :keyword" +
            "OR customerphone like :keyword" +
            "OR province like :keyword" +
            ")",
          {
            keyword: "%" + dto.keyword + "%"
          }
        );
      query = query.orderBy("id", "DESC");

      const result = new VibIntroducesResponseDto();

      let data, count;
      [data, count] = await query.getManyAndCount();
      result.count = count;
      result.rows = this.convertEntities2Dtos(
        data,
        VIBIntroduce,
        VibIntroduceResponseDto
      );
      return result;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async createIntroduce(dto: VibIntroduceDto) {
    let dtoReq = new GetVibIntroduceRequestDto();
    dtoReq.source = dto.source;
    let introduces = await this.getAllIntroduces(dtoReq);
    let response: VibIntroduceResponseDto;
    if (introduces.count > 0) {
      response = introduces.rows[0];
      let updateDto = new VibIntroduceUpdateDto();
      updateDto.id = response.id;
      updateDto.source = dto.source;
      updateDto.introduceby = dto.introduceby;
      updateDto.cardtype = dto.cardtype;
      updateDto.customername = dto.customername;
      updateDto.customerphone = dto.customerphone;
      updateDto.province = dto.statuslead;
      updateDto.statusapproval = dto.statusapproval;
      updateDto.intidate = dto.intidate;
      updateDto.carddeliverydate = dto.carddeliverydate;
      updateDto.cardactivedate = dto.cardactivedate;
      await this.updateVibIntroduce(updateDto);
    } else {
      let arr = dto.source.split("-");
      dto.introduceby = arr[arr.length - 1];
      let entity: VIBIntroduce = this.convertDto2Entity(dto, VIBIntroduce);
      entity.createdBy = dto.createdBy;
      entity.createdAt = new Date();

      this.logger.verbose(`entity = ${JSON.stringify(entity)}`);
      let result = await this.connection
        .getCustomRepository(VibIntroduceRepository)
        .save(entity);
      this.logger.verbose(`insertResult = ${result}`);

      response = this.convertEntity2Dto(result, VIBIntroduce, VibIntroduceDto);
    }
    console.log("Ghi log");
    console.log(response);

    let logDto = new VibIntroduceLogDto();
    logDto.introduceid = response.id;
    logDto.statuslead = dto.statuslead;
    logDto.statusapproval = dto.statusapproval;
    logDto.intidate = dto.intidate;
    logDto.carddeliverydate = dto.carddeliverydate;
    logDto.createdBy = dto.createdBy;
    let log = await this.writeLog(logDto);
    console.log(log);
    return response;
  }
  async writeLog(dto: VibIntroduceLogDto) {
    console.log(dto);
    let entity: VIBIntroduceLog = this.convertDto2Entity(dto, VIBIntroduceLog);
    entity.createdBy = dto.createdBy;
    entity.createdAt = new Date();

    this.logger.verbose(`entity = ${JSON.stringify(entity)}`);
    let result = await this.connection
      .getCustomRepository(VibIntroduceLogRepository)
      .save(entity);
    this.logger.verbose(`insertResult = ${result}`);

    let response: VibIntroduceDto = this.convertEntity2Dto(
      result,
      VIBIntroduceLog,
      VibIntroduceLogDto
    );
    return response;
  }
  async getVibIntroduce(id: number) {
    let result = await this.connection
      .getCustomRepository(VibIntroduceRepository)
      .findOne(id);
    let response: VibIntroduceResponseDto = this.convertEntity2Dto(
      result,
      VIBIntroduce,
      VibIntroduceResponseDto
    );
    return response;
  }
  async updateVibIntroduce(dto: VibIntroduceUpdateDto) {
    let arr = dto.source.split("-");
    dto.introduceby = arr[arr.length - 1];
    let entityUpdate: VIBIntroduce = this.convertDto2Entity(dto, VIBIntroduce);

    entityUpdate.updatedBy = dto.updatedBy;
    entityUpdate.updatedAt = new Date();
    let result = await this.connection
      .getCustomRepository(VibIntroduceRepository)
      .save(entityUpdate);
    let response: VibIntroduceUpdateDto = this.convertEntity2Dto(
      result,
      VIBIntroduce,
      VibIntroduceUpdateDto
    );
    return response;
  }
  async updateVibIntroduceCommission(dto: VibIntroduceUpdateCommissionDto) {
    let entityUpdate: VIBIntroduce = this.convertDto2Entity(dto, VIBIntroduce);
    entityUpdate.updatedBy = dto.updatedBy;
    entityUpdate.updatedAt = new Date();
    let result = await this.connection
      .getCustomRepository(VibIntroduceRepository)
      .save(entityUpdate);
    let response: VibIntroduceUpdateDto = this.convertEntity2Dto(
      result,
      VIBIntroduce,
      VibIntroduceUpdateCommissionDto
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
}
