import {
  BadRequestException,
  HttpService,
  Inject,
  Injectable,
  Scope
} from "@nestjs/common";

import {
  GetMCLoanProfilesRequestDto,
  LoanProfileResponseDto,
  LoanProfilesResponseDto,
  McLoanProfileDto,
  LoanProfileUpdateDto
} from "./dto";
import { BaseService } from "../../../common/services";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { Logger } from "../../../common/loggers";
import { RedisClient } from "../../../common/shared";
import { RequestUtil } from "../../../common/utils";

import * as moment from "moment";
import { McLoanProfile, SendDataLog } from "../../../entities";

import * as config from "config";

import { McLoanProfileRepository } from "../../../repositories/mc/mc-loan-profile.repository";
import { CheckInitContractRequestDto } from "./dto/check-init-contract.request.dto";
import { McCheckListrequestDto } from "./dto/mc-check-listrequest.dto";
import { McapiUtil } from "../../../common/utils/mcapi.util";
import { McAttachfilesResponseDto } from "../mc-attachfile/dto/mc-attachfiles.response.dto";
import {
  LoanProfileRepository,
  McAttachfileRepository,
  SaleGroupRepository
} from "../../../repositories";
import { GetMCAttachfileRequestDto } from "../mc-attachfile/dto/mc-get-attachfile.request.dto";
import { McAttachfileService } from "../mc-attachfile/mc-attachfile.service";
import { GetMCCaseRequestDto } from "../mc-case/dto/get-case.request.dto";
import { GetMcCaseRequestDto } from "./dto/get-mc-case.request.dto";
import { McCaseNoteRepository } from "../../../repositories/mc/mc-case-note.repository";
import { requestSendOtp3PDto } from "./dto/requestSendOtp3P.dto";
import { requestScoring3PDto } from "./dto/requestScoring3P.dto";
import { IsNull, Like } from "typeorm";
import {McCaseNoteDto} from "../mc-case-note/dto/mc-case-note.dto";
import {McCaseNoteService} from "../mc-case-note/mc-case-note.service";

@Injectable()
export class McLoanProfileService extends BaseService {
  constructor(
    @Inject(REQUEST) protected request: Request,
    protected readonly logger: Logger,
    protected readonly redisClient: RedisClient,
    private readonly requestUtil: RequestUtil,
    @Inject(HttpService) private readonly httpService: HttpService
  ) {
    super(request, logger, redisClient);
  }

  async getAllLoanProfiles(dto: GetMCLoanProfilesRequestDto) {
    try {
      const repo = this.connection.getCustomRepository(McLoanProfileRepository);
      let query = repo.createQueryBuilder().where("deleted_at is null");

      if (dto.shopCode)
        query = query.andWhere("shopCode = :shopCode", {
          shopCode: dto.shopCode
        });
      if (dto.saleCode)
        query = query.andWhere("saleCode = :saleCode", {
          saleCode: dto.saleCode
        });
      if (dto.mobileProductType)
        query = query.andWhere("loan_status = :mobileProductType", {
          loanStatus: dto.mobileProductType
        });
      if (dto.cicResult)
        query = query.andWhere("cicResult = :cicResult", {
          cicResult: dto.cicResult
        });
      if (dto.status)
        query = query.andWhere("status = :status", {
          status: dto.status
        });
      if (dto.bpmStatus)
        query = query.andWhere("bpmStatus = :bpmStatus", {
          bpmStatus: dto.bpmStatus
        });
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

      if (dto.completedatfrom)
        query = query.andWhere("completedat >= :completedatfrom", {
          completedatfrom: dto.completedatfrom
        });
      if (dto.completedatto)
        query = query.andWhere("completedat <= :completedatto", {
          completedatto: dto.completedatto
        });
      if (dto.keyword)
        query = query.andWhere(
          "loan_application_id like :keyword OR loan_public_id like :keyword OR first_name like :keyword OR middle_name like :keyword OR last_name like :keyword OR id_document_number like :keyword ",
          { keyword: "%" + dto.keyword + "%" }
        );
      query = query
        .orderBy("id", "DESC")
        .skip((dto.page - 1) * dto.pagesize)
        .take(dto.pagesize);
      const result = new LoanProfilesResponseDto();

      let data, count;
      [data, count] = await query.getManyAndCount();
      result.count = count;
      result.rows = this.convertEntities2Dtos(
        data,
        McLoanProfile,
        LoanProfileResponseDto
      );
      return result;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  async getbpmStatus() {
    console.log("getbpmStatus");
    try {
      const rawData = await this.connection.query(
        `SELECT DISTINCT bpmStatus FROM mc_loan_profile`
      );
      return rawData;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
  async getSaleCode() {
    console.log("getSaleCode");
    try {
      const rawData = await this.connection.query(
        `SELECT DISTINCT saleCode FROM mc_loan_profile`
      );
      return rawData;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
  async getLoanProfile(loanProfileId: number) {
    let result = await this.connection
      .getCustomRepository(McLoanProfileRepository)
      .findOne(loanProfileId);
    let response: LoanProfileResponseDto = this.convertEntity2Dto(
      result,
      McLoanProfile,
      LoanProfileResponseDto
    );
    return response;
  }

  async checkCIC(citizenId, customerName) {
    console.log(
      "Check cic citizenId: " + citizenId + " customerName: " + customerName
    );
    let mcapi = new McapiUtil(this.redisClient, this.httpService);
    var response = await mcapi.checkCIC(citizenId, customerName);
    return response;
  }

  async checkCitizenId(citizenId) {
    console.log("Check cic citizenId: " + citizenId + " customerName: ");
    let mcapi = new McapiUtil(this.redisClient, this.httpService);
    var response = await mcapi.checkCitizenId(citizenId);
    return response;
  }

  async checkInitContract(loan_profile_id) {
    console.log("checkInitContract");
    let mcapi = new McapiUtil(this.redisClient, this.httpService);
    let dto = new CheckInitContractRequestDto();
    var loanProfile = await this.getLoanProfile(loan_profile_id);
    dto.productId = loanProfile.productId;
    dto.customerName = loanProfile.customerName;
    dto.citizenId = loanProfile.citizenId;
    dto.loanAmount = loanProfile.loanAmount;
    dto.loanTenor = loanProfile.loanTenor;
    dto.customerIncome = loanProfile.customerIncome;
    dto.dateOfBirth = loanProfile.dateOfBirth;
    dto.gender = loanProfile.gender;
    dto.issuePlace = loanProfile.issuePlace;
    dto.hasInsurance = loanProfile.hasInsurance;
    var response = await mcapi.checkInitContract(dto);
    const repo = this.connection.getCustomRepository(McLoanProfileRepository);

    let queryupdate;
    switch (response.returnCode) {
      case "200":
        let returnMes = JSON.parse(response.returnMes);
        console.log(returnMes[0]);
        //Cập nhât Profile
        queryupdate = repo
          .createQueryBuilder()
          .update()
          .set({
            status: "checkpass",
            checkcontract: returnMes[0].outputType,
            checkcontractdes: returnMes[0].outputValue
          })
          .where("id = :id", { id: loan_profile_id });
        await queryupdate.execute();
        break;
      case "400":
        console.log(response.returnMes);
        //Cập nhât Profile
        queryupdate = repo
          .createQueryBuilder()
          .update()
          .set({
            status: "checkfailed",
            checkcontract: "RED",
            checkcontractdes: response.returnMes
          })
          .where("id = :id", { id: loan_profile_id });
        await queryupdate.execute();
        break;
    }
    return response;
  }

  async checkList(dto: McCheckListrequestDto) {
    console.log("checkList");
    let mcapi = new McapiUtil(this.redisClient, this.httpService);
    var response = await mcapi.checkList(dto);
    return response;
  }

  async uploadDocument(id) {
    console.log("uploadDocument service");
    let loanProfileDTO = await this.getLoanProfile(id);
    console.log(loanProfileDTO);
    let attachRequest = new GetMCAttachfileRequestDto();
    attachRequest.profileid = id;
    attachRequest.page = 1;
    attachRequest.pagesize = 0;
    let attachserviec = new McAttachfileService(
      this.request,
      this.logger,
      this.redisClient,
      this.requestUtil
    );
    let attachFiles = new McAttachfilesResponseDto();
    attachFiles = await attachserviec.getAllAttachfile(attachRequest);
    let mcapi = new McapiUtil(this.redisClient, this.httpService);
    var response = await mcapi.uploadDocument(loanProfileDTO, attachFiles);
    //Update profileid
    if (response.returnCode == 200) {
      let profileid = response.id;
      const repo = this.connection.getCustomRepository(McLoanProfileRepository);
      let query = repo
        .createQueryBuilder()
        .update()
        .set({
          profileid: profileid,
          status: "hadsend"
        })
        .where("id = :id", { id: id });
      await query.execute();
    } else {
      let profileid = response.id;
      const repo = this.connection.getCustomRepository(McLoanProfileRepository);
      let query = repo
        .createQueryBuilder()
        .update()
        .set({
          status: "sendfailed"
        })
        .where("id = :id", { id: id });
      await query.execute();
    }
    return response;
  }

  async checkCategory(companyTaxNumber) {
    console.log("checkCategory");
    let mcapi = new McapiUtil(this.redisClient, this.httpService);
    var response = await mcapi.checkCategory(companyTaxNumber);
    return response;
  }

  async listCaseNote(id) {
    console.log("listCaseNote");
    let mcapi = new McapiUtil(this.redisClient, this.httpService);
    let loanProfile = await this.getLoanProfile(id);
    console.log(loanProfile.appNumber);
    var response = await mcapi.listCaseNote(loanProfile.appNumber);
    return response;
  }

  async getReturnChecklist(id) {
    console.log("getReturnChecklist");
    let mcapi = new McapiUtil(this.redisClient, this.httpService);
    let loanProfile = await this.getLoanProfile(id);
    console.log(loanProfile.appid);
    var response = await mcapi.getReturnChecklist(loanProfile.appid);
    return response;
  }

  async getCases(dto: GetMcCaseRequestDto) {
    console.log("getCases");
    let mcapi = new McapiUtil(this.redisClient, this.httpService);
    const repo = this.connection.getCustomRepository(McLoanProfileRepository);
    var response = await mcapi.getCases(dto);
    console.log(response);
    for (const item of response) {
      console.log(item);
      let query = repo.createQueryBuilder().where("deleted_at is null");
      query = query.andWhere("profileid = :profileid", {
        profileid: item.id
      });
      let data;
      data = await query.getOne();
      console.log(data);
      if (data != undefined) {
        //Cập nhât Profile
        let queryupdate = repo
          .createQueryBuilder()
          .update()
          .set({
            appNumber: item.appNumber,
            appid: item.appId,
            bpmStatus: item.bpmStatus,
            reasons: JSON.stringify(item.reasons),
            pdfFiles: JSON.stringify(item.pdfFiles)
          })
          .where("id = :id", { id: data.id });
        await queryupdate.execute();
      }
      //console.log(count);
    }
    return response;
  }

  async requestSendOtp3P(dto: requestSendOtp3PDto) {
    console.log("requestSendOtp3P");
    let mcapi = new McapiUtil(this.redisClient, this.httpService);
    var response = await mcapi.requestSendOtp3P(dto.phone, dto.typeScore);
    return response;
  }

  async requestScoring3P(dto: requestScoring3PDto) {
    console.log("requestScoring3P");
    let mcapi = new McapiUtil(this.redisClient, this.httpService);
    var response = await mcapi.requestScoring3P(dto);
    return response;
  }

  async cancelCase(profileid:number, reason:number, comment:string) {
    console.log("cancelCase");
    try {
      let loanProfile = await this.getLoanProfile(profileid);
      console.log(loanProfile);
      let dtoCaseNode = new McCaseNoteDto();
      dtoCaseNode.profileid = loanProfile.profileid;
      dtoCaseNode.appNumber = loanProfile.appNumber;
      dtoCaseNode.app_uid = loanProfile.appid;
      dtoCaseNode.note_content = reason==0?'Không có nhu cầu vay':'Lý do khác'+' - '+comment;
      let serviceCaseNote = new McCaseNoteService(this.request,this.logger,this.redisClient,this.requestUtil,this.httpService);
      serviceCaseNote.createCaseNote(dtoCaseNode);
      let mcapi = new McapiUtil(this.redisClient, this.httpService);
      var response = await mcapi.cancelCase(dtoCaseNode.profileid, reason, comment);
      return response;
    }catch (e) {
      console.log(e);
    }

  }

  async createLoanProfile(dto: McLoanProfileDto) {
    let ptfApiConfig = config.get("ptf_api");
    console.log(dto);
    let entity: McLoanProfile = this.convertDto2Entity(dto, McLoanProfile);
    entity.catType = "NEW";
    entity.mobileProductType = dto.mobileProductType;
    entity.hasInsurance = 1;
    entity.tempResidence = 1;
    entity.createdBy = dto.createdBy;
    entity.createdAt = new Date();

    this.logger.verbose(`entity = ${JSON.stringify(entity)}`);
    let result = await this.connection
      .getCustomRepository(McLoanProfileRepository)
      .save(entity);
    this.logger.verbose(`insertResult = ${result}`);

    let response: McLoanProfileDto = this.convertEntity2Dto(
      result,
      McLoanProfile,
      McLoanProfileDto
    );
    return response;
  }

  async updateLoanProfile(dto: LoanProfileUpdateDto) {
    let entityUpdate: McLoanProfile = this.convertDto2Entity(
      dto,
      McLoanProfile
    );
    entityUpdate.updatedBy = dto.updatedBy;
    entityUpdate.updatedAt = new Date();
    let result = await this.connection
      .getCustomRepository(McLoanProfileRepository)
      .save(entityUpdate);
    let response: LoanProfileUpdateDto = this.convertEntity2Dto(
      result,
      McLoanProfile,
      LoanProfileUpdateDto
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
