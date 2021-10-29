import { BadRequestException, Inject, Injectable, Scope } from "@nestjs/common";

import { BaseService } from "../../../common/services";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { Logger } from "../../../common/loggers";
import { RedisClient } from "../../../common/shared";
import { RequestUtil } from "../../../common/utils";

import * as moment from "moment";
import * as config from "config";

import { McCaseNote } from "../../../entities";
import { GetMCCaseNoteRequestDto } from "./dto/get-case-note.request.dto";
import { McCaseNoteRepository } from "../../../repositories/mc/mc-case-note.repository";
import { McCaseNotesResponseDto } from "./dto/mc-case-notes.response.dto";
import { McCaseNoteResponseDto } from "./dto/mc-case-note.response.dto";
import { McCaseNoteDto } from "./dto/mc-case-note.dto";
import { McCaseNoteUpdateDto } from "./dto/mc-case-note.update.dto";

@Injectable()
export class McCaseNoteService extends BaseService {
  constructor(
    @Inject(REQUEST) protected request: Request,
    protected readonly logger: Logger,
    protected readonly redisClient: RedisClient,
    private readonly requestUtil: RequestUtil
  ) {
    super(request, logger, redisClient);
  }

  async getAllCaseNotes(dto: GetMCCaseNoteRequestDto) {
    try {
      const repo = this.connection.getCustomRepository(McCaseNoteRepository);
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
      const result = new McCaseNotesResponseDto();

      let data, count;
      [data, count] = await query.getManyAndCount();
      result.count = count;
      result.rows = this.convertEntities2Dtos(
        data,
        McCaseNote,
        McCaseNoteResponseDto
      );
      return result;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getCaseNote(id: number) {
    let result = await this.connection
      .getCustomRepository(McCaseNoteRepository)
      .findOne(id);
    let response: McCaseNoteResponseDto = this.convertEntity2Dto(
      result,
      McCaseNote,
      McCaseNoteResponseDto
    );
    return response;
  }

  async createCaseNote(dto: McCaseNoteDto) {
    console.log(dto);
    let entity: McCaseNote = this.convertDto2Entity(dto, McCaseNote);
    entity.createdAt = new Date();
    console.log(entity);
    this.logger.verbose(`entity = ${JSON.stringify(entity)}`);
    let result = await this.connection
      .getCustomRepository(McCaseNoteRepository)
      .save(entity);
    this.logger.verbose(`insertResult = ${result}`);

    let response: McCaseNoteDto = this.convertEntity2Dto(
      result,
      McCaseNote,
      McCaseNoteDto
    );
    return response;
  }

  async updateCaseNote(dto: McCaseNoteUpdateDto) {
    let entityUpdate: McCaseNote = this.convertDto2Entity(dto, McCaseNote);
    entityUpdate.updatedBy = dto.updatedBy;
    entityUpdate.updatedAt = new Date();
    let result = await this.connection
      .getCustomRepository(McCaseNoteRepository)
      .save(entityUpdate);
    let response: McCaseNoteUpdateDto = this.convertEntity2Dto(
      result,
      McCaseNote,
      McCaseNoteUpdateDto
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
