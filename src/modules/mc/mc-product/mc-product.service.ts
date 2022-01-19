import {
  BadRequestException,
  HttpService,
  Inject,
  Injectable,
  Scope
} from "@nestjs/common";
import { In, IsNull, Like } from "typeorm";
import * as moment from "moment";
import {
  Address,
  LoanProfile,
  McCaseNote,
  McLoanProfile,
  McProduct,
  Process,
  PtfAddress,
  PtfAttachFile,
  PtfEmploymentInformation,
  PtfLoanProfile,
  PtfLoanProfileDefer,
  PtfRelatedPerson,
  SendDataLog
} from "../../../entities";
import * as FormData from "form-data";
import * as fs from "fs";
import * as config from "config";
import { ProcessDto } from "../../mafc/loan-profile/dto";

import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { Logger } from "../../../common/loggers";
import { RedisClient } from "../../../common/shared";
import { RequestUtil } from "../../../common/utils";

import {
  McProductRepository,
  SendDataLogRepository
} from "../../../repositories";
import { BaseService } from "../../../common/services";
import { McapiUtil } from "../../../common/utils/mcapi.util";

import { GetMCProductRequestDto } from "./dto/get-product.request.dto";

import { McProductDto } from "./dto/mc-product.dto";
import { McProductsResponseDto } from "./dto/mc-products.response.dto";
import { McProductResponseDto } from "./dto/mc-product.response.dto";
import { McProductUpdateDto } from "./dto/mc-product.update.dto";

@Injectable()
export class McProductService extends BaseService {
  constructor(
    @Inject(REQUEST) protected request: Request,
    protected readonly logger: Logger,
    protected readonly redisClient: RedisClient,
    private readonly requestUtil: RequestUtil,
    @Inject(HttpService) private readonly httpService: HttpService
  ) {
    super(request, logger, redisClient);
  }

  async getProducts() {
    console.log("Get Products");
    let mcapi = new McapiUtil(this.redisClient, this.httpService);
    var response = await mcapi.getProducts();
    for (const i in response) {
      response[i].productName = response[i].productName.trim();
    }
    return response;
  }

  async getAllProducts(dto: GetMCProductRequestDto) {
    try {
      const repo = this.connection.getCustomRepository(McProductRepository);
      let query = repo.createQueryBuilder().where("deleted_at is null");
      if (dto.productid) {
        query = query.andWhere("productid = :productid", {
          productid: dto.productid
        });
      }
      if (dto.keyword)
        query = query.andWhere("productname like :keyword", {
          keyword: "%" + dto.keyword + "%"
        });
      query = query.orderBy("id", "DESC");

      const result = new McProductsResponseDto();

      let data, count;
      [data, count] = await query.getManyAndCount();
      result.count = count;
      result.rows = this.convertEntities2Dtos(
        data,
        McProduct,
        McProductResponseDto
      );
      return result;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getProduct(id: number) {
    let result = await this.connection
      .getCustomRepository(McProductRepository)
      .findOne(id);
    let response: McProductResponseDto = this.convertEntity2Dto(
      result,
      McProduct,
      McProductResponseDto
    );
    return response;
  }

  async createProduct(dto: McProductDto) {
    //Kiểm tra có tồn tại id
    let reqDto = new GetMCProductRequestDto();
    reqDto.productid = dto.productid;
    let dtoProductResponses = await this.getAllProducts(reqDto);
    console.log(dtoProductResponses);
    if (dtoProductResponses.count == 0) {
      let entity: McProduct = this.convertDto2Entity(dto, McProduct);
      entity.createdBy = dto.createdBy;
      entity.createdAt = new Date();
      console.log(entity);
      this.logger.verbose(`entity = ${JSON.stringify(entity)}`);
      let result = await this.connection
        .getCustomRepository(McProductRepository)
        .save(entity);
      this.logger.verbose(`insertResult = ${result}`);
      console.log(result);
      let response: McProductDto = this.convertEntity2Dto(
        result,
        McProduct,
        McProductDto
      );
      return response;
    } else {
      return {
        statusCode: 300,
        message: "Sản phẩm bị trùng"
      };
    }
  }

  async updateProduct(dto: McProductUpdateDto) {
    let entityUpdate: McProduct = this.convertDto2Entity(dto, McProduct);
    entityUpdate.updatedBy = dto.updatedBy;
    entityUpdate.updatedAt = new Date();
    let result = await this.connection
      .getCustomRepository(McProductRepository)
      .save(entityUpdate);
    let response: McProductUpdateDto = this.convertEntity2Dto(
      result,
      McProduct,
      McProductUpdateDto
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
