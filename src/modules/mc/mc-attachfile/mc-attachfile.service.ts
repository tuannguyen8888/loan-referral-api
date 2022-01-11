import { BadRequestException, Inject, Injectable, Scope } from "@nestjs/common";

import { BaseService } from "../../../common/services";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { Logger } from "../../../common/loggers";
import { RedisClient } from "../../../common/shared";
import { RequestUtil } from "../../../common/utils";
import * as moment from "moment";
import * as config from "config";

import {
  McAttachfileRepository,
  McLoanProfileRepository
} from "../../../repositories";
import { McAttachfilesResponseDto } from "./dto/mc-attachfiles.response.dto";
import { McAttachfile } from "../../../entities";
import { GetMCAttachfileRequestDto } from "./dto/mc-get-attachfile.request.dto";
import { McAttachfileResponseDto } from "./dto/mc-attachfile.response.dto";
import { McAttachfileDto } from "./dto/mc-attachfile.dto";
import { McAttachfileUpdateDto } from "./dto/mc-attachfile.update.dto";
import { McAttachfileDeleteDto } from "./dto/mc-attachfile.delete.dto";

@Injectable()
export class McAttachfileService extends BaseService {
  constructor(
    @Inject(REQUEST) protected request: Request,
    protected readonly logger: Logger,
    protected readonly redisClient: RedisClient,
    private readonly requestUtil: RequestUtil
  ) {
    super(request, logger, redisClient);
  }

  async getAllAttachfile(dto: GetMCAttachfileRequestDto) {
    try {
      const repo = this.connection.getCustomRepository(McAttachfileRepository);
      let query = repo.createQueryBuilder().where("deleted_at is null");

      if (dto.profileid) {
        query = query.andWhere("profileid = :profileid", {
          profileid: dto.profileid
        });
      }
      if (dto.documentCode) {
        query = query.andWhere("documentCode = :documentCode", {
          documentCode: dto.documentCode
        });
      }
      if (dto.groupId) {
        query = query.andWhere("groupId = :groupId", {
          groupId: dto.groupId
        });
      }
      if (dto.arrgroupId) {
        query = query.andWhere("groupId in (:arrgroupId)", {
          arrgroupId: dto.arrgroupId
        });
      }
      if (dto.hassend == 0) {
        query = query.andWhere("hassend is null");
      }
      if (dto.hassend) {
        query = query.andWhere("hassend = :hassend", {
          hassend: dto.hassend
        });
      }
      if (dto.keyword)
        query = query.andWhere(
          "( fileName like :keyword " +
            "OR documentCode like :keyword OR mimeType like :keyword OR url like :keyword )",
          { keyword: "%" + dto.keyword + "%" }
        );
      if (dto.pagesize > 0) {
        query = query
          .orderBy("id", "DESC")
          .skip((dto.page - 1) * dto.pagesize)
          .take(dto.pagesize);
      } else {
        query = query.orderBy("id", "DESC");
      }

      const result = new McAttachfilesResponseDto();

      let data, count;
      [data, count] = await query.getManyAndCount();
      result.count = count;
      result.rows = this.convertEntities2Dtos(
        data,
        McAttachfile,
        McAttachfileResponseDto
      );
      return result;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getAttachfile(id: number) {
    let result = await this.connection
      .getCustomRepository(McAttachfileRepository)
      .findOne(id);
    let response: McAttachfileResponseDto = this.convertEntity2Dto(
      result,
      McAttachfile,
      McAttachfileResponseDto
    );
    return response;
  }

  async createAttachfile(dto: McAttachfileDto) {
    console.log(dto);
    let entity: McAttachfile = this.convertDto2Entity(dto, McAttachfile);
    entity.createdAt = new Date();
    console.log(entity);
    this.logger.verbose(`entity = ${JSON.stringify(entity)}`);
    let result = await this.connection
      .getCustomRepository(McAttachfileRepository)
      .save(entity);
    this.logger.verbose(`insertResult = ${result}`);

    let response: McAttachfileDto = this.convertEntity2Dto(
      result,
      McAttachfile,
      McAttachfileDto
    );
    return response;
  }

  async updateAttachfile(dto: McAttachfileUpdateDto) {
    let entityUpdate: McAttachfile = this.convertDto2Entity(dto, McAttachfile);
    entityUpdate.updatedBy = dto.updatedBy;
    entityUpdate.updatedAt = new Date();
    let result = await this.connection
      .getCustomRepository(McAttachfileRepository)
      .save(entityUpdate);
    let response: McAttachfileUpdateDto = this.convertEntity2Dto(
      result,
      McAttachfile,
      McAttachfileUpdateDto
    );
    return response;
  }
  async deleteAttachfile(dto: McAttachfileDeleteDto) {
    try {
      let attactFile = await this.getAttachfile(dto.id);
      const repo = this.connection.getCustomRepository(McAttachfileRepository);
      if (attactFile.deletedBy == null) {
        let queryupdate = repo
          .createQueryBuilder()
          .update()
          .set({
            deletedAt: new Date(),
            deletedBy: dto.deletedBy
          })
          .where("id = :id", { id: dto.id });
        await queryupdate.execute();
        return {
          statusCode: 200,
          message: "Xóa thành công"
        };
      } else {
        return {
          statusCode: 403,
          message: "Đã bị xóa!"
        };
      }
    } catch (e) {
      return {
        statusCode: 404,
        message: "Không tồn tại!"
      };
    }
  }
  async updateColAttachfile(id: number, col: string, value: any) {
    try {
      let attactFile = await this.getAttachfile(id);
      const repo = this.connection.getCustomRepository(McAttachfileRepository);
      let jsonstr = `{"${col}":"${value}"}`;
      if (attactFile.deletedBy == null) {
        let queryupdate = repo
          .createQueryBuilder()
          .update()
          .set(JSON.parse(jsonstr))
          .where("id = :id", { id: id });
        await queryupdate.execute();
        return {
          statusCode: 200,
          message: "Update thành công"
        };
      } else {
        return {
          statusCode: 403,
          message: "Đã bị xóa!"
        };
      }
    } catch (e) {
      return {
        statusCode: 404,
        message: "Không tồn tại!"
      };
    }
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
