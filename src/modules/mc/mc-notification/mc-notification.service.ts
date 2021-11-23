import {
  BadRequestException,
  HttpService,
  Inject,
  Injectable,
  Scope
} from "@nestjs/common";

import { BaseService } from "../../../common/services";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { Logger } from "../../../common/loggers";
import { RedisClient } from "../../../common/shared";
import { RequestUtil } from "../../../common/utils";
import * as moment from "moment";
import * as config from "config";

import { McNotification } from "../../../entities";

import { GetMCnotificationRequestDto } from "./dto/get-notification.request.dto";
import {
  McLoanProfileRepository,
  McNotificationRepository
} from "../../../repositories";
import { McNotificationResponseDto } from "./dto/mc-notification.response.dto";
import { McNotificationsResponseDto } from "./dto/mc-notifications.response.dto";
import { McNotificationDto } from "./dto/mc-notification.dto";
import { McNotificationUpdateDto } from "./dto/mc-notification.update.dto";
import { McLoanProfileService } from "../mc-loan-profile/mc-loan-profile.service";

@Injectable()
export class McNotificationService extends BaseService {
  constructor(
    @Inject(REQUEST) protected request: Request,
    protected readonly logger: Logger,
    protected readonly redisClient: RedisClient,
    private readonly requestUtil: RequestUtil,
    @Inject(HttpService) private readonly httpService: HttpService
  ) {
    super(request, logger, redisClient);
  }

  async getAllNotification(dto: GetMCnotificationRequestDto) {
    try {
      const repo = this.connection.getCustomRepository(
        McNotificationRepository
      );
      let query = repo.createQueryBuilder().where("deleted_at is null");
      if (dto.keyword)
        query = query.andWhere(
          "loan_application_id like :keyword OR loan_public_id like :keyword OR first_name like :keyword OR middle_name like :keyword OR last_name like :keyword OR id_document_number like :keyword ",
          { keyword: "%" + dto.keyword + "%" }
        );
      query = query
        .orderBy("id", "DESC")
        .skip((dto.page - 1) * dto.pagesize)
        .take(dto.pagesize);
      const result = new McNotificationsResponseDto();

      let data, count;
      [data, count] = await query.getManyAndCount();
      result.count = count;
      result.rows = this.convertEntities2Dtos(
        data,
        McNotification,
        McNotificationResponseDto
      );
      return result;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  async getNotification(id: number) {
    let result = await this.connection
      .getCustomRepository(McNotificationRepository)
      .findOne(id);
    let response: McNotificationResponseDto = this.convertEntity2Dto(
      result,
      McNotification,
      McNotificationResponseDto
    );
    return response;
  }

  async createNotification(dto: McNotificationDto) {
    console.log(dto);
    const repo = this.connection.getCustomRepository(McLoanProfileRepository);
    let query = repo.createQueryBuilder().where("deleted_at is null");
    query = query.andWhere("profileid = :profileid", {
      profileid: dto.id
    });
    let loanProfileResponse = await query.getOne();
    console.log(loanProfileResponse);
    if (loanProfileResponse != undefined) {
      let entity: McNotification = this.convertDto2Entity(dto, McNotification);
      entity.id = null;
      entity.profileid = dto.id;
      entity.createdAt = new Date();
      console.log(entity);
      this.logger.verbose(`entity = ${JSON.stringify(entity)}`);
      let result = await this.connection
        .getCustomRepository(McNotificationRepository)
        .save(entity);
      this.logger.verbose(`insertResult = ${result}`);

      //let loanProfileService = new McLoanProfileService(this.request,this.logger,this.redisClient,this.requestUtil,this.httpService);

      //Cập nhật trạng thái
      if (dto.currentStatus == "Hoàn thành") {
        let queryupdate = repo
          .createQueryBuilder()
          .update()
          .set({
            bpmStatus: dto.currentStatus,
            completedat: new Date()
          })
          .where("id = :id", { id: loanProfileResponse.id });
        await queryupdate.execute();
      } else {
        let queryupdate = repo
          .createQueryBuilder()
          .update()
          .set({
            bpmStatus: dto.currentStatus,
            appNumber:dto.appNumber,
            appid:dto.appId
          })
          .where("id = :id", { id: loanProfileResponse.id });
        await queryupdate.execute();
      }

      let response: McNotificationDto = this.convertEntity2Dto(
        result,
        McNotification,
        McNotificationDto
      );
      return {
        statusCode: 200,
        message: "Gửi thông báo thành công",
        data: response
      };
    } else {
      return {
        statusCode: 500,
        message: "Không tìm thấy hồ sơ!"
      };
    }
  }

  async updateNotification(dto: McNotificationUpdateDto) {
    let entityUpdate: McNotification = this.convertDto2Entity(
      dto,
      McNotification
    );
    entityUpdate.updatedBy = dto.updatedBy;
    entityUpdate.updatedAt = new Date();
    let result = await this.connection
      .getCustomRepository(McNotificationRepository)
      .save(entityUpdate);
    let response: McNotificationUpdateDto = this.convertEntity2Dto(
      result,
      McNotification,
      McNotificationUpdateDto
    );
    return response;
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
