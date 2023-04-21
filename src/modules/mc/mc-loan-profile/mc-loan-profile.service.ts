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
import { McCaseNoteDto } from "../mc-case-note/dto/mc-case-note.dto";
import { McCaseNoteService } from "../mc-case-note/mc-case-note.service";
import { McScoringTrackingService } from "../mc-scoring-tracking/mc-scoring-tracking.service";
import { McScoringTrackingDto } from "../mc-scoring-tracking/dto/mc-scoring-tracking.dto";
import { GetMCScoringTrackingRequestDto } from "../mc-scoring-tracking/dto/get-scoring-tracking.request.dto";
import { McScoringTrackingResponseDto } from "../mc-scoring-tracking/dto/mc-scoring-tracking.response.dto";
import { McScoringTrackingUpdateDto } from "../mc-scoring-tracking/dto/mc-scoring-tracking.update.dto";
import { McApiTrackingService } from "../mc-api-tracking/mc-api-tracking.service";
import { McApiTrackingDto } from "../mc-api-tracking/dto/mc-api-tracking.dto";

@Injectable()
export class McLoanProfileService extends BaseService {
  constructor(
    @Inject(REQUEST) protected request: Request,
    protected readonly logger: Logger,
    protected readonly redisClient: RedisClient,
    private readonly requestUtil: RequestUtil,
    protected mcapi: McapiUtil,
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
        query = query.andWhere("mobileProductType = :mobileProductType", {
          mobileProductType: dto.mobileProductType
        });
      if (dto.cicResult)
        query = query.andWhere("cicResult = :cicResult", {
          cicResult: dto.cicResult
        });
      if (dto.status)
        query = query.andWhere("status = :status", {
          status: dto.status
        });
      if (dto.citizenId)
        query = query.andWhere("citizenId = :citizenId", {
          citizenId: dto.citizenId
        });
      if (dto.refid)
        query = query.andWhere("refid = :refid", {
          refid: dto.refid
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
      if (dto.createfrom)
        query = query.andWhere("created_at >= :createfrom", {
          createfrom: dto.createfrom
        });
      if (dto.createto)
        query = query.andWhere("created_at <= :createto", {
          createto: dto.createto + " 23:59:59"
        });
      if (dto.keyword) {
        query = query.andWhere(
          "(citizenId like :keyword " +
            "OR customerName like :keyword " +
            "OR address like :keyword " +
            "OR appNumber like :keyword " +
            "OR permanentaddress like :keyword " +
            "OR phone like :keyword " +
            "OR catType like :keyword " +
            "OR compAddrStreet like :keyword " +
            "OR officeNumber like :keyword " +
            "OR companyTaxNumber like :keyword " +
            "OR created_by like :keyword " +
            "OR compName like :keyword )",
          { keyword: "%" + dto.keyword.trim() + "%" }
        );
      }

      if (dto.pagesize != 0) {
        query = query
          .orderBy("id", "DESC")
          .skip((dto.page - 1) * dto.pagesize)
          .take(dto.pagesize);
      } else {
        query = query.orderBy("id", "DESC");
      }

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
    //console.log("getbpmStatus");
    try {
      const rawData = await this.connection.query(
        `SELECT DISTINCT bpmStatus
                 FROM mc_loan_profile`
      );
      return rawData;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async getSaleCode() {
    // console.log("getSaleCode");
    try {
      const rawData = await this.connection.query(
        `SELECT DISTINCT saleCode
                 FROM mc_loan_profile`
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
    response.productName = response.productName.trim();
    return response;
  }

  async checkCIC(citizenId, customerName, user_id) {
    //console.log("Check cic citizenId: " + citizenId + " customerName: " + customerName);
    // let dtoreq = new GetMCLoanProfilesRequestDto();
    // dtoreq.citizenId = citizenId;
    // dtoreq.page=1;
    // dtoreq.pagesize = 0;
    // let loanProfiles = await this.getAllLoanProfiles(dtoreq);
    // console.log(loanProfiles.count);
    // if(loanProfiles.count == 0){
    //   let mcapi = new McapiUtil(this.redisClient, this.httpService);
    //   var response = await mcapi.checkCIC(citizenId, customerName);
    //   return response;
    // }else {
    //   return {
    //     "returnCode": "400",
    //     "returnMes": "Tham số CMND/CCCD đã tồn tại trong hệ thống"
    //   }
    // }
    var response = await this.mcapi.checkCIC(citizenId, customerName);
    let url = "mobile-4sales/check-cic/check";
    var mcApiTrackingService = new McApiTrackingService(
      this.request,
      this.logger,
      this.redisClient,
      this.requestUtil,
      this.httpService
    );
    let dtoApiTracking = new McApiTrackingDto();
    dtoApiTracking.apiname = "checkCIC";
    dtoApiTracking.url = url;
    dtoApiTracking.method = "get";
    dtoApiTracking.payload = JSON.stringify({
      citizenId: citizenId,
      customerName: customerName
    });
    dtoApiTracking.response = JSON.stringify(response);
    dtoApiTracking.createdBy = user_id;
    await mcApiTrackingService.createApiTracking(dtoApiTracking);
    return response;
  }

  async checkCitizenId(citizenId, productCode, user_id) {
    //console.log("Check cic citizenId: " + citizenId + " customerName: ");
    var response = await this.mcapi.checkCitizenId(citizenId, productCode);
    let url = "mobile-4sales/check-identifier";
    var mcApiTrackingService = new McApiTrackingService(
      this.request,
      this.logger,
      this.redisClient,
      this.requestUtil,
      this.httpService
    );
    let dtoApiTracking = new McApiTrackingDto();
    dtoApiTracking.apiname = "checkCitizenId";
    dtoApiTracking.url = url;
    dtoApiTracking.method = "get";
    dtoApiTracking.payload = JSON.stringify({
      citizenId: citizenId,
      productCode: productCode
    });
    dtoApiTracking.response = JSON.stringify(response);
    dtoApiTracking.createdBy = user_id;
    await mcApiTrackingService.createApiTracking(dtoApiTracking);
    return response;
  }

  async checkInitContract(loan_profile_id) {
    //console.log("checkInitContract");
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
    var response = await this.mcapi.checkInitContract(dto);
    const repo = this.connection.getCustomRepository(McLoanProfileRepository);

    let queryupdate;
    switch (response.returnCode) {
      case "200":
        let returnMes = JSON.parse(response.returnMes);
        //console.log(returnMes[0]);
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
        //console.log(response.returnMes);
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
    //console.log("checkList");
    var response = await this.mcapi.checkList(dto);
    return response;
  }

  async uploadDocument(id, appStatus) {
    //console.log("uploadDocument new");
    //console.log(appStatus);
    let loanProfileResponseDTO = await this.getLoanProfile(id);
    //console.log(loanProfileResponseDTO);

    let attachRequest = new GetMCAttachfileRequestDto();
    let attachFiles = new McAttachfilesResponseDto();
    let attachserviec = new McAttachfileService(
      this.request,
      this.logger,
      this.redisClient,
      this.mcapi
    );
    if (appStatus == 1) {
      attachRequest.profileid = id;
      attachRequest.page = 1;
      attachRequest.pagesize = 0;
      let attachserviec = new McAttachfileService(
        this.request,
        this.logger,
        this.redisClient,
        this.mcapi
      );
      attachFiles = await attachserviec.getAllAttachfile(attachRequest);
    } else {
      //Get return checklist
      let returnchecklist = await this.mcapi.getReturnChecklist(
        loanProfileResponseDTO.appid
      );
      //console.log(returnchecklist);
      if (returnchecklist["returnCode"] == "400") {
        return returnchecklist;
      }
      let arr_groupid = new Array();
      for (const group of returnchecklist["checkList"]) {
        //console.log(group);
        arr_groupid.push(group["groupId"]);
      }
      // console.log(arr_groupid);
      // console.log("------------");
      attachRequest.profileid = id;
      //attachRequest.arrgroupId = arr_groupid.join(",");
      attachRequest.hassend = 0;
      attachRequest.page = 1;
      attachRequest.pagesize = 0;

      attachFiles = await attachserviec.getAllAttachfile(attachRequest);
    }
    var response = await this.mcapi.uploadDocument(
      loanProfileResponseDTO,
      attachFiles,
      appStatus
    );
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
      //Cập nhật mc_attachfile.hassend = 1
      for (const attachFile of attachFiles.rows) {
        //console.log(attachFile.id);
        await attachserviec.updateColAttachfile(attachFile.id, "hassend", 1);
      }
    } else {
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
    // console.log("checkCategory");
    var response = await this.mcapi.checkCategory(companyTaxNumber);
    return response;
  }

  async listCaseNote(id) {
    // console.log("listCaseNote");
    let loanProfile = await this.getLoanProfile(id);
    // console.log(loanProfile.appNumber);
    var response = await this.mcapi.listCaseNote(loanProfile.appNumber);
    return response;
  }

  async getReturnChecklist(id) {
    // console.log("getReturnChecklist");
    let loanProfile = await this.getLoanProfile(id);
    // console.log(loanProfile.appid);
    var response = await this.mcapi.getReturnChecklist(loanProfile.appid);
    return response;
  }

  async downloadPDF(fileid) {
    // console.log("downloadPDF");
    var response = await this.mcapi.downloadPDF(fileid);
    return response;
  }

  async getCases(dto: GetMcCaseRequestDto) {
    // console.log("getCases " + dto.status + " hasCourier = " + dto.hasCourier);
    const repo = this.connection.getCustomRepository(McLoanProfileRepository);
    var response = await this.mcapi.getCases(dto);
    try {
      for (const item of response) {
        // console.log(item);
        let query = repo.createQueryBuilder().where("deleted_at is null");
        query = query.andWhere("profileid = :profileid", {
          profileid: item.id
        });
        let data;
        data = await query.getOne();
        // console.log(data);
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
    } catch (e) {}

    return response;
  }

  async requestSendOtp3P(dto: requestSendOtp3PDto) {
    // console.log("requestSendOtp3P");
    var response = await this.mcapi.requestSendOtp3P(dto.phone, dto.typeScore);
    let scoringTrackingService = new McScoringTrackingService(
      this.request,
      this.logger,
      this.redisClient,
      this.requestUtil,
      this.httpService
    );
    let dtoScoringTracking = new McScoringTrackingDto();
    dtoScoringTracking.typeScore = dto.typeScore;
    dtoScoringTracking.primaryPhone = dto.phone;
    dtoScoringTracking.fullname = dto.customerName;
    dtoScoringTracking.requestSendOtp3P = JSON.stringify(response);
    dtoScoringTracking.createdBy = dto.user_id;
    await scoringTrackingService.createScoringTracking(dtoScoringTracking);
    return response;
  }

  async requestScoring3P(dto: requestScoring3PDto) {
    // console.log("requestScoring3P");
    var response = await this.mcapi.requestScoring3P(dto);
    let requestScoringTracking = new GetMCScoringTrackingRequestDto();
    requestScoringTracking.primaryPhone = dto.primaryPhone;
    let scoringTrackingService = new McScoringTrackingService(
      this.request,
      this.logger,
      this.redisClient,
      this.requestUtil,
      this.httpService
    );

    let result = await scoringTrackingService.getAllScoringTrackings(
      requestScoringTracking
    );
    // console.log(result);
    let responseScoringTracking = result["rows"][0];
    let dtoUpdate = new McScoringTrackingUpdateDto();
    dtoUpdate.id = responseScoringTracking.id;
    dtoUpdate.typeScore = responseScoringTracking.typeScore;
    dtoUpdate.primaryPhone = responseScoringTracking.primaryPhone;
    dtoUpdate.nationalId = dto.nationalId;
    dtoUpdate.verificationCode = dto.verificationCode;
    dtoUpdate.requestSendOtp3P = responseScoringTracking.requestSendOtp3P;
    dtoUpdate.requestScoring3P = JSON.stringify(response);
    dtoUpdate.updatedBy = dto.user_id;
    await scoringTrackingService.updateScoringTracking(dtoUpdate);
    return response;
  }

  async cancelCase(profileid: number, reason: number, comment: string) {
    // console.log("cancelCase");
    try {
      let loanProfile = await this.getLoanProfile(profileid);
      if (loanProfile.appNumber != null) {
        let dtoCaseNode = new McCaseNoteDto();
        dtoCaseNode.profileid = loanProfile.id;
        dtoCaseNode.appNumber = loanProfile.appNumber;
        dtoCaseNode.app_uid = loanProfile.appid;
        dtoCaseNode.note_content =
          reason == 0 ? "Không có nhu cầu vay" : "Lý do khác" + " - " + comment;
        let serviceCaseNote = new McCaseNoteService(
          this.request,
          this.logger,
          this.redisClient,
          this.requestUtil,
          this.mcapi,
          this.httpService
        );

        serviceCaseNote.createCaseNote(dtoCaseNode);
        var response = await this.mcapi.cancelCase(
          loanProfile.profileid,
          reason,
          comment
        );
        if (response.returnCode == 200) {
          const repo = this.connection.getCustomRepository(
            McLoanProfileRepository
          );
          let queryupdate = repo
            .createQueryBuilder()
            .update()
            .set({
              status: "cancelcase"
            })
            .where("id = :id", { id: profileid });
          await queryupdate.execute();
        }
        return response;
      } else {
        return {
          returnCode: "400",
          returnMes: "Hồ sơ chưa được duyệt"
        };
      }
    } catch (e) {
      // console.log("ERR");
      console.error(e);
      return {
        returnCode: "400",
        returnMes: "Không tồn tại hồ sơ"
      };
    }
  }

  async createLoanProfile(dto: McLoanProfileDto) {
    // console.log(dto);
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
    //console.log("entityKeys = ", entityKeys);
    let dtoKeys = Object.getOwnPropertyNames(dto);
    //console.log("dtoKeys = ", dtoKeys);
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
