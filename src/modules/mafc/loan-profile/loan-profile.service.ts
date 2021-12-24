import { Injectable, Scope, Inject, BadRequestException } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { BaseService } from "../../../common/services/index";
import { Logger } from "../../../common/loggers/index";
import { RedisClient } from "../../../common/shared/index";
import {
  AddressDto,
  GetLoanProfilesRequestDto,
  LoanProfileDto,
  LoanProfilesResponseDto,
  LoanProfileResponseDto,
  LoanProfileDeferDto,
  LoanProfileChangeLogDto,
  ProcessDto,
  InputQdeDto,
  InputQdeAddressDto,
  InputQdeReferenceDto,
  InputDdeDto,
  InputDataUpdateDto,
  InputDataUpdateAddressDto
} from "./dto/index";
import {
  AddressRepository,
  AttachFileRepository,
  LoanProfileChangeLogRepository,
  LoanProfileDeferReplyRepository,
  LoanProfileDeferRepository,
  LoanProfileRepository,
  ProcessRepository,
  ReferenceRepository,
  SaleGroupRepository,
  SendDataLogRepository
} from "../../../repositories/index";
import { IsNull, Like, Equal, In, Not } from "typeorm";
import {
  Address,
  AttachFile,
  LoanProfile,
  Process,
  Reference,
  LoanProfileDefer,
  LoanProfileChangeLog,
  SendDataLog,
  LoanProfileDeferReply
} from "../../../entities/index";
import { RequestUtil } from "../../../common/utils/index";
import * as config from "config";
import { AttachFileDto } from "./dto/attach-file.dto";
import * as moment from "moment";
import { ReferenceDto } from "./dto/reference.dto";
import * as fs from "fs";
import * as FormData from "form-data";
import {
  LoanProfileDeferReplyRequestDto,
  DeferReplyDto
} from "./dto/loan-profile-defer-reply.request.dto";

@Injectable({ scope: Scope.DEFAULT })
export class LoanProfileService extends BaseService {
  constructor(
    @Inject(REQUEST) protected request: Request,
    protected readonly logger: Logger,
    protected readonly redisClient: RedisClient,
    private readonly requestUtil: RequestUtil
  ) {
    super(request, logger, redisClient);
  }

  async getAllLoanProfiles(dto: GetLoanProfilesRequestDto) {
    try {
      // console.log("getAllLoanProfiles dto = ", dto);
      const repo = this.connection.getCustomRepository(LoanProfileRepository);
      let query = repo.createQueryBuilder().where("deleted_at is null");
      if (dto.fv_status)
        query = query.andWhere("fv_status = :fvStatus", {
          fvStatus: dto.fv_status
        });
      // const where = {
      //   deletedAt: IsNull()
      // };
      if (dto.partner_id) {
        query = query.andWhere("partner_id = :partnerId", {
          partnerId: dto.partner_id
        });
        // where["partnerId"] = dto.partner_id;
      }
      if (dto.fv_status) {
        query = query.andWhere("fv_status = :fvStatus", {
          fvStatus: dto.fv_status
        });
        // where["fvStatus"] = Equal(dto.fv_status);
      }
      if (dto.loan_status) {
        query = query.andWhere("loan_status = :loanStatus", {
          loanStatus: dto.loan_status
        });
        // where["loanStatus"] = Equal(dto.loan_status);
      }
      if (dto.disbursement_date_from) {
        query = query.andWhere(
          "loan_status = 'FINISH' and updated_at >= :disbursementDateFrom",
          {
            disbursementDateFrom: dto.disbursement_date_from
          }
        );
      }
      if (dto.disbursement_date_to) {
        query = query.andWhere(
          "loan_status = 'FINISH' and updated_at < DATE_ADD(:disbursementDateTo, INTERVAL 1 DAY)",
          {
            disbursementDateTo: dto.disbursement_date_to
          }
        );
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
          // where["createdBy"] = In(userEmails);
          query = query.andWhere("created_by IN (:...userEmails)", {
            userEmails: userEmails
          });
        } else {
          // where["createdBy"] = dto.user_id;
          query = query.andWhere("created_by = :userId", {
            userId: dto.user_id
          });
        }
      }
      if (dto.keyword) {
        query = query.andWhere(
          // "concat(in_fname,' ', in_mname, ' ', in_lname) like :keyword OR in_nationalid like :keyword OR loan_no like :keyword ",
          "( in_nationalid like :keyword OR loan_no like :keyword )",
          { keyword: "%" + dto.keyword + "%" }
        );
        // where["$or"] = [
        //   { inFname: Like(`%${dto.keyword}%`) },
        //   { inMname: Like(`%${dto.keyword}%`) },
        //   { inLname: Like(`%${dto.keyword}%`) },
        //   { inPhone: Like(`%${dto.keyword}%`) },
        //   { inNationalid: Like(`%${dto.keyword}%`) },
        //   { loanNo: Like(`%${dto.keyword}%`) }
        // ];
      }
      const result = new LoanProfilesResponseDto();
      result.rows = [];
      if (!dto.sort) {
        query = query
          .orderBy("id", "DESC")
          .skip((dto.page - 1) * dto.pagesize)
          .take(dto.pagesize);
        // dto.sort = { id: -1 };
      } else {
        query = query
          .orderBy(
            Object.keys(dto.sort)[0],
            Object.values(dto.sort)[0] == -1 ? "DESC" : "ASC"
          )
          .skip((dto.page - 1) * dto.pagesize)
          .take(dto.pagesize);
      }
      let data, count;
      [data, count] = await query.getManyAndCount();
      result.count = count;

      const quickDeferCodes = [
        "D2.4.5",
        "D2.9.1",
        "D2.9.2",
        "D4.1",
        "D4.10",
        "D4.9",
        "D2.5",
        "D2.1"
      ];
      if (data && data.length) {
        for (const item of data) {
          let lp: LoanProfileDto = this.convertEntity2Dto(
            item,
            LoanProfile,
            LoanProfileDto
          );
          // lp = Object.assign(lp, item);
          if (lp.loan_status == "FINISH") {
            lp.disbursement_date = lp.updated_at;
          }
          if (lp.fv_status == "NEED_UPDATE") {
            let defers: LoanProfileDefer[] = await this.connection
              .getCustomRepository(LoanProfileDeferRepository)
              .find({
                where: {
                  deletedAt: IsNull(),
                  loanProfileId: lp.id,
                  status: "NEW"
                }
              });
            let isQuickDefer = true;
            for (const defer of defers) {
              if (!quickDeferCodes.includes(defer.deferCode)) {
                // console.log('defer.deferCode = ]'+defer.deferCode+'[');
                // console.log('quickDeferCodes = '+quickDeferCodes);
                isQuickDefer = false;
                break;
              }
            }
            lp.is_quick_defer = isQuickDefer;
          }
          result.rows.push(lp);
        }
      }
      // console.log("result = ", result);
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

  // private convertAttachFileEntity2Dto(entity: AttachFile) {
  //     let dto = new AttachFileDto();
  //     let dtoKeys = Object.getOwnPropertyNames(dto);
  //     let entityKeys = Object.getOwnPropertyNames(entity);
  //     for (let dtoKey of dtoKeys) {
  //         for (let entityKey of entityKeys) {
  //             if (
  //                 dtoKey
  //                     .toLowerCase()
  //                     .split("_")
  //                     .join("") ==
  //                 entityKey
  //                     .toLowerCase()
  //                     .split("_")
  //                     .join("")
  //             ) {
  //                 dto[dtoKey] = entity[entityKey];
  //                 break;
  //             }
  //         }
  //     }
  //     dto.created_at = entity.createdAt
  //         ? moment(entity.createdAt).format("YYYY-MM-DD HH:mm:ss")
  //         : null;
  //     dto.updated_at = entity.updatedAt
  //         ? moment(entity.updatedAt).format("YYYY-MM-DD HH:mm:ss")
  //         : null;
  //     dto.deleted_at = entity.deletedAt
  //         ? moment(entity.deletedAt).format("YYYY-MM-DD HH:mm:ss")
  //         : null;
  //     return dto;
  // }

  // private convertAttachFileDto2Entity(dto: AttachFileDto) {
  //     let entity = new AttachFile();
  //     let entityKeys = Object.getOwnPropertyNames(entity);
  //     let dtoKeys = Object.getOwnPropertyNames(dto);
  //     for (let entityKey of entityKeys) {
  //         for (let dtoKey of dtoKeys) {
  //             if (
  //                 dtoKey
  //                     .toLowerCase()
  //                     .split("_")
  //                     .join("") ==
  //                 entityKey
  //                     .toLowerCase()
  //                     .split("_")
  //                     .join("")
  //             ) {
  //                 entity[entityKey] = dto[dtoKey];
  //                 break;
  //             }
  //         }
  //     }
  //     entity.createdAt = dto.created_at ? new Date(dto.created_at) : null;
  //     entity.updatedAt = dto.updated_at ? new Date(dto.updated_at) : null;
  //     entity.deletedAt = dto.deleted_at ? new Date(dto.deleted_at) : null;
  //     return entity;
  // }

  // private convertAttachFileDtos2Entities(dtos: AttachFileDto[]) {
  //     let entities = [];
  //     if (dtos && dtos.length) {
  //         dtos.forEach(dto => entities.push(this.convertAttachFileDto2Entity(dto)));
  //     }
  //     return entities;
  // }
  //
  // private convertAttachFileEntities2Dtos(entities: AttachFile[]) {
  //     let dtos: AttachFileDto[] = [];
  //     if (entities && entities.length) {
  //         entities.forEach(entity =>
  //             dtos.push(this.convertAttachFileEntity2Dto(entity))
  //         );
  //     }
  //     return dtos;
  // }

  async getLoanProfile(loanProfileId: number) {
    const loanProfile = await this.connection
      .getCustomRepository(LoanProfileRepository)
      .findOne(loanProfileId);
    if (loanProfile) {
      const address = await this.connection
        .getCustomRepository(AddressRepository)
        .find({
          where: {
            deletedAt: IsNull(),
            loanProfileId: loanProfile.id
          }
        });
      const references = await this.connection
        .getCustomRepository(ReferenceRepository)
        .find({
          where: {
            deletedAt: IsNull(),
            loanProfileId: loanProfile.id
          }
        });
      const attachFiles = await this.connection
        .getCustomRepository(AttachFileRepository)
        .find({
          where: {
            deletedAt: IsNull(),
            loanProfileId: loanProfile.id
          }
        });
      const process = await this.connection
        .getCustomRepository(ProcessRepository)
        .find({
          where: {
            deletedAt: IsNull(),
            loanProfileId: loanProfile.id
          }
        });
      const defers = await this.connection
        .getCustomRepository(LoanProfileDeferRepository)
        .find({
          where: {
            deletedAt: IsNull(),
            loanProfileId: loanProfile.id,
            status: "NEW"
          }
        });
      const oldDefers = await this.connection
        .getCustomRepository(LoanProfileDeferRepository)
        .find({
          where: {
            deletedAt: IsNull(),
            loanProfileId: loanProfile.id,
            status: Not(Equal("NEW"))
          }
        });
      const changeLogs = await this.connection
        .getCustomRepository(LoanProfileChangeLogRepository)
        .find({
          where: {
            deletedAt: IsNull(),
            loanProfileId: loanProfile.id
          }
        });

      let result: LoanProfileResponseDto = this.convertEntity2Dto(
        loanProfile,
        LoanProfile,
        LoanProfileResponseDto
      );
      result.address = this.convertEntities2Dtos(address, Address, AddressDto);
      result.references = this.convertEntities2Dtos(
        references,
        Reference,
        ReferenceDto
      );
      result.attach_files = this.convertEntities2Dtos(
        attachFiles,
        AttachFile,
        AttachFileDto
      );
      result.process = this.convertEntities2Dtos(process, Process, ProcessDto);
      result.defers = this.convertEntities2Dtos(
        defers,
        LoanProfileDefer,
        LoanProfileDeferDto
      );
      result.old_defers = this.convertEntities2Dtos(
        oldDefers,
        LoanProfileDefer,
        LoanProfileDeferDto
      );
      if (result.old_defers && result.old_defers.length) {
        for (let i = 0; i < oldDefers.length; i++) {
          let replies = await this.connection
            .getCustomRepository(LoanProfileDeferReplyRepository)
            .find({
              where: {
                deletedAt: IsNull(),
                deferId: result.old_defers[i].id
              }
            });
          result.old_defers[i].details = this.convertEntities2Dtos(
            replies,
            LoanProfileDeferReply,
            DeferReplyDto
          );
        }
      }
      result.change_logs = this.convertEntities2Dtos(
        changeLogs,
        LoanProfileChangeLog,
        LoanProfileChangeLogDto
      );
      if (result.loan_status == "FINISH") {
        result.disbursement_date = result.updated_at;
      }
      return result;
    } else {
      throw new BadRequestException([
        `loan_profile_id ${loanProfileId} is not exits.`
      ]);
    }
  }

  async createLoanProfile(dto: LoanProfileDto) {
    let response: LoanProfileDto;
    let entityOld = await this.connection
      .getCustomRepository(LoanProfileRepository)
      .findOne({
        where: {
          deletedAt: IsNull(),
          inNationalid: dto.in_nationalid,
          loanStatus: Not(In(["CAN", "REJ", "FINISH"]))
        }
      });
    if (entityOld) {
      throw new BadRequestException(
        `Số CMND ${dto.in_nationalid} đã tồn tại hồ sơ đang xử lý trong hệ thống. Vui lòng kiểm tra lại.`
      );
    }
    let error = null;
    let qdeResult = await this.sendData_inputQDE(dto);
    console.log("qdeResult = ", qdeResult);
    let entity: LoanProfile = this.convertDto2Entity(dto, LoanProfile);
    if (!qdeResult.success) {
      error = new BadRequestException(qdeResult, "error from MAFC SENT_QDE");
    } else {
      dto.loan_no = qdeResult.data;
      entity.loanNo = qdeResult.data;
      // entity.status = "ACTIVE";
      entity.partnerId = 2; //MAFC
      entity.fvStatus = "SENT_QDE";
      entity.loanStatus = "QDE";
      entity.createdAt = new Date();
      let qdeChangeResult = await this.sendData_procQDEChangeState(
        entity.loanNo
      );
      if (!qdeChangeResult.success) {
        error = new BadRequestException(
          qdeChangeResult,
          "error from MAFC SENT_QDTChangeToDDE"
        );
      } else {
        entity.fvStatus = "SENT_QDTChangeToDDE";
        entity.loanStatus = "DDE";
        let ddeResult = await this.sendData_inputDDE(dto);
        if (!ddeResult.success) {
          error = new BadRequestException(
            ddeResult,
            "error from MAFC SENT_DDE"
          );
        } else {
          entity.fvStatus = "SENT_DDE";
          let ddeChangeResult = await this.sendData_procDDEChangeState(
            entity.loanNo
          );
          if (!ddeChangeResult.success) {
            error = new BadRequestException(
              ddeChangeResult,
              "error from MAFC SENT_DDEChangeToPOL"
            );
          } else {
            entity.fvStatus = "SENT_DDEChangeToPOL";
            entity.loanStatus = "POL";
          }
        }
      }
      this.logger.verbose(`entity = ${JSON.stringify(entity)}`);
      let result = await this.connection
        .getCustomRepository(LoanProfileRepository)
        .save(entity);
      this.logger.verbose(`insertResult = ${result}`);
      let address = this.convertDtos2Entities(dto.address, Address);
      address.forEach(item => (item.loanProfileId = result.id));
      address = await this.connection
        .getCustomRepository(AddressRepository)
        .save(address);
      let references = this.convertDtos2Entities(dto.references, Reference);
      references.forEach(item => (item.loanProfileId = result.id));

      references = await this.connection
        .getCustomRepository(ReferenceRepository)
        .save(references);
      response = this.convertEntity2Dto(result, LoanProfile, LoanProfileDto);
      response.address = this.convertEntities2Dtos(
        address,
        Address,
        AddressDto
      );
      response.references = this.convertEntities2Dtos(
        references,
        Reference,
        ReferenceDto
      );
    }
    if (error) {
      throw error;
    } else {
      return response;
    }
  }

  private async sendData_inputQDE(dto: LoanProfileDto) {
    let mafc_api_config = config.get("mafc_api");
    let inputQdeDto = new InputQdeDto();
    let qdeResult;
    try {
      inputQdeDto.in_channel = mafc_api_config.partner_code;
      inputQdeDto.in_schemeid = dto.in_schemeid;
      inputQdeDto.in_downpayment = dto.in_downpayment ? dto.in_downpayment : 0;
      inputQdeDto.in_totalloanamountreq = dto.in_totalloanamountreq;
      inputQdeDto.in_tenure = dto.in_tenure;
      inputQdeDto.in_sourcechannel = "ADVT"; //dto.in_sourcechannel;
      inputQdeDto.in_salesofficer = dto.in_salesofficer;
      inputQdeDto.in_loanpurpose = dto.in_loanpurpose;
      inputQdeDto.in_creditofficercode = "EXT_FIV";
      inputQdeDto.in_bankbranchcode = dto.in_bankbranchcode;
      inputQdeDto.in_laa_app_ins_applicable = dto.in_laa_app_ins_applicable;
      inputQdeDto.in_possipbranch = dto.in_possipbranch;
      inputQdeDto.in_priority_c = dto.in_priority_c;
      inputQdeDto.in_userid = "EXT_FIV"; //dto.in_userid;
      inputQdeDto.in_title = dto.in_title;
      inputQdeDto.in_fname = dto.in_fname;
      inputQdeDto.in_mname = dto.in_mname;
      inputQdeDto.in_lname = dto.in_lname;
      inputQdeDto.in_gender = dto.in_gender;
      inputQdeDto.in_nationalid = dto.in_nationalid;
      inputQdeDto.in_dob = dto.in_dob;
      inputQdeDto.in_constid = dto.in_constid;
      inputQdeDto.in_tax_code = dto.in_tax_code;
      inputQdeDto.in_presentjobyear = dto.in_presentjobyear;
      inputQdeDto.in_presentjobmth = dto.in_presentjobmth;
      inputQdeDto.in_previousjobyear = dto.in_previousjobyear;
      inputQdeDto.in_previousjobmth = dto.in_previousjobmth;
      inputQdeDto.in_referalgroup = dto.in_referalgroup;
      inputQdeDto.in_addresstype = dto.in_addresstype;
      inputQdeDto.in_addressline = dto.in_addressline;
      inputQdeDto.in_country = dto.in_country;
      inputQdeDto.in_city = dto.in_city;
      inputQdeDto.in_district = dto.in_district;
      inputQdeDto.in_ward = dto.in_ward;
      inputQdeDto.in_phone = dto.in_phone;
      inputQdeDto.in_others = dto.in_others;
      inputQdeDto.in_position = dto.in_position;
      inputQdeDto.in_natureofbuss = dto.in_natureofbuss;
      inputQdeDto.in_head = dto.in_head;
      inputQdeDto.in_frequency = dto.in_frequency;
      inputQdeDto.in_amount = dto.in_amount;
      inputQdeDto.in_accountbank = dto.in_accountbank;
      inputQdeDto.in_debit_credit = dto.in_debit_credit;
      inputQdeDto.in_per_cont = dto.in_per_cont;
      inputQdeDto.msgName = "inputQDE";
      inputQdeDto.address = [];
      if (dto.address && dto.address.length) {
        dto.address.forEach(item => {
          let address = new InputQdeAddressDto();
          address.in_addresstype = item.address_type;
          address.in_propertystatus = item.property_status;
          address.in_address1stline = item.address_1st_line;
          address.in_country = item.country;
          address.in_city = item.city;
          address.in_district = item.district;
          address.in_ward = item.ward;
          address.in_roomno = item.roomno;
          address.in_stayduratcuradd_y = item.stayduratcuradd_y;
          address.in_stayduratcuradd_m = item.stayduratcuradd_m;
          address.in_mailingaddress = item.mailing_address;
          address.in_mobile = item.mobile;
          address.in_landlord = item.landlord;
          address.in_landmark = item.landmark;
          address.in_email = item.email;
          address.In_fixphone = item.fixphone;
          inputQdeDto.address.push(address);
        });
      }
      inputQdeDto.reference = [];
      if (dto.references && dto.references.length) {
        dto.references.forEach(item => {
          let refer = new InputQdeReferenceDto();
          refer.in_title = item.title;
          refer.in_refereename = item.referee_name;
          refer.in_refereerelation = item.referee_relation;
          refer.in_phone_1 = item.phone_1;
          inputQdeDto.reference.push(refer);
        });
      }
      console.log("call api MAFC: ", [
        mafc_api_config.input_data_entry.url,
        inputQdeDto,
        {
          auth: {
            username: mafc_api_config.input_data_entry.username,
            password: mafc_api_config.input_data_entry.password
          }
        }
      ]);
      qdeResult = await this.requestUtil.post(
        mafc_api_config.input_data_entry.url,
        inputQdeDto,
        {
          auth: {
            username: mafc_api_config.input_data_entry.username,
            password: mafc_api_config.input_data_entry.password
          }
        }
      );
      console.log("qdeResult = ", qdeResult);
    } catch (e) {
      console.log(e);
      qdeResult = e;
    } finally {
      let log = new SendDataLog();
      log.apiUrl = "inputQDE";
      log.keyword =
        (qdeResult.data ? qdeResult.data + "-" : "") +
        inputQdeDto.in_nationalid +
        "-" +
        inputQdeDto.in_phone;
      log.data = JSON.stringify([
        mafc_api_config.input_data_entry.url,
        inputQdeDto,
        {
          auth: {
            username: mafc_api_config.input_data_entry.username,
            password: mafc_api_config.input_data_entry.password
          }
        }
      ]);
      log.result = JSON.stringify(qdeResult);
      log.createdAt = new Date();
      await this.connection
        .getCustomRepository(SendDataLogRepository)
        .save(log);
    }
    return qdeResult;
  }

  public async sendData_procQDEChangeState(loanNo: string) {
    let mafc_api_config = config.get("mafc_api");
    let result;
    try {
      console.log("call api MAFC: ", [
        mafc_api_config.input_data_entry.url,
        {
          p_appid: Number(loanNo),
          in_userid: "EXT_FIV",
          in_channel: "FIV",
          msgName: "procQDEChangeState"
        },
        {
          auth: {
            username: mafc_api_config.input_data_entry.username,
            password: mafc_api_config.input_data_entry.password
          }
        }
      ]);
      result = await this.requestUtil.post(
        mafc_api_config.input_data_entry.url,
        {
          p_appid: Number(loanNo),
          in_userid: "EXT_FIV",
          in_channel: "FIV",
          msgName: "procQDEChangeState"
        },
        {
          auth: {
            username: mafc_api_config.input_data_entry.username,
            password: mafc_api_config.input_data_entry.password
          }
        }
      );
    } catch (e) {
      console.log(e);
      result = e;
    } finally {
      let log = new SendDataLog();
      log.apiUrl = "procQDEChangeState";
      log.keyword = loanNo;
      log.data = JSON.stringify([
        mafc_api_config.input_data_entry.url,
        {
          p_appid: Number(loanNo),
          in_userid: "EXT_FIV",
          in_channel: "FIV",
          msgName: "procQDEChangeState"
        },
        {
          auth: {
            username: mafc_api_config.input_data_entry.username,
            password: mafc_api_config.input_data_entry.password
          }
        }
      ]);
      log.result = JSON.stringify(result);
      log.createdAt = new Date();
      await this.connection
        .getCustomRepository(SendDataLogRepository)
        .save(log);
    }
    return result;
  }

  private async sendData_inputDDE(dto: LoanProfileDto) {
    let mafc_api_config = config.get("mafc_api");
    let inputDdeDto = new InputDdeDto();
    let ddeResult;
    try {
      inputDdeDto.in_channel = mafc_api_config.partner_code;
      inputDdeDto.in_userid = "EXT_FIV";
      inputDdeDto.in_appid = Number(dto.loan_no);
      inputDdeDto.in_maritalstatus = dto.in_maritalstatus;
      inputDdeDto.in_qualifyingyear = dto.in_qualifyingyear;
      inputDdeDto.in_eduqualify = dto.in_eduqualify;
      inputDdeDto.in_noofdependentin = dto.in_noofdependentin;
      inputDdeDto.in_paymentchannel = dto.in_paymentchannel;
      inputDdeDto.in_nationalidissuedate = dto.in_nationalidissuedate;
      inputDdeDto.in_familybooknumber = dto.in_familybooknumber;
      inputDdeDto.in_idissuer = dto.in_idissuer;
      inputDdeDto.in_spousename = dto.in_spousename;
      inputDdeDto.in_spouse_id_c = dto.in_spouse_id_c;
      inputDdeDto.in_categoryid = "FIV";
      inputDdeDto.in_bankname = dto.in_bankname;
      inputDdeDto.in_bankbranch = dto.in_bankbranch;
      inputDdeDto.in_acctype = dto.in_acctype;
      inputDdeDto.in_accno = dto.in_accno;
      inputDdeDto.in_dueday = dto.in_dueday;
      inputDdeDto.in_notecode = dto.in_notecode;
      inputDdeDto.in_notedetails = dto.in_notedetails;
      inputDdeDto.msgName = "inputDDE";
      console.log("call api MAFC: ", [
        mafc_api_config.input_data_entry.url,
        inputDdeDto,
        {
          auth: {
            username: mafc_api_config.input_data_entry.username,
            password: mafc_api_config.input_data_entry.password
          }
        }
      ]);
      ddeResult = await this.requestUtil.post(
        mafc_api_config.input_data_entry.url,
        inputDdeDto,
        {
          auth: {
            username: mafc_api_config.input_data_entry.username,
            password: mafc_api_config.input_data_entry.password
          }
        }
      );
    } catch (e) {
      console.log(e);
      ddeResult = e;
    } finally {
      let log = new SendDataLog();
      log.apiUrl = "inputDDE";
      log.keyword = inputDdeDto.in_appid.toString();
      log.data = JSON.stringify([
        mafc_api_config.input_data_entry.url,
        inputDdeDto,
        {
          auth: {
            username: mafc_api_config.input_data_entry.username,
            password: mafc_api_config.input_data_entry.password
          }
        }
      ]);
      log.result = JSON.stringify(ddeResult);
      log.createdAt = new Date();
      await this.connection
        .getCustomRepository(SendDataLogRepository)
        .save(log);
    }
    return ddeResult;
  }

  public async sendData_procDDEChangeState(loanNo: string) {
    let mafc_api_config = config.get("mafc_api");
    let result;
    try {
      console.log("call api MAFC: ", [
        mafc_api_config.input_data_entry.url,
        {
          p_appid: Number(loanNo),
          in_userid: "EXT_FIV",
          in_channel: "FIV",
          msgName: "procDDEChangeState"
        },
        {
          auth: {
            username: mafc_api_config.input_data_entry.username,
            password: mafc_api_config.input_data_entry.password
          }
        }
      ]);
      result = await this.requestUtil.post(
        mafc_api_config.input_data_entry.url,
        {
          p_appid: Number(loanNo),
          in_userid: "EXT_FIV",
          in_channel: "FIV",
          msgName: "procDDEChangeState"
        },
        {
          auth: {
            username: mafc_api_config.input_data_entry.username,
            password: mafc_api_config.input_data_entry.password
          }
        }
      );
    } catch (e) {
      console.log(e);
      result = e;
    } finally {
      let log = new SendDataLog();
      log.apiUrl = "procDDEChangeState";
      log.keyword = loanNo;
      log.data = JSON.stringify([
        mafc_api_config.input_data_entry.url,
        {
          p_appid: Number(loanNo),
          in_userid: "EXT_FIV",
          in_channel: "FIV",
          msgName: "procDDEChangeState"
        },
        {
          auth: {
            username: mafc_api_config.input_data_entry.username,
            password: mafc_api_config.input_data_entry.password
          }
        }
      ]);
      log.result = JSON.stringify(result);
      log.createdAt = new Date();
      await this.connection
        .getCustomRepository(SendDataLogRepository)
        .save(log);
    }
    return result;
  }

  private async sendData_pushToUND(
    loanProfile: LoanProfile,
    customerName: string,
    attachFiles: AttachFile[]
  ) {
    let mafc_api_config = config.get("mafc_api");
    let download_config = config.get("download");
    let result: any;
    let isError = false;
    let formData_log;
    let files = [];
    try {
      let formData = new FormData();
      formData_log = {};
      formData_log["warning"] = "N";
      formData_log["warning_msg"] = "";
      formData_log["appid"] = loanProfile.loanNo;
      formData_log["salecode"] = "EXT_FIV";
      formData_log["usersname"] = "EXT_FIV";
      formData_log["password"] = "mafc123!";
      formData_log["vendor"] = "EXT_FIV";
      formData.append("warning", "N");
      formData.append("warning_msg", "");
      formData.append("appid", loanProfile.loanNo);
      formData.append("salecode", "EXT_FIV");
      formData.append("usersname", "EXT_FIV");
      formData.append("password", "mafc123!");
      formData.append("vendor", "EXT_FIV");
      for (let i = 0; i < attachFiles.length; i++) {
        if (attachFiles[i].url && attachFiles[i].url.trim() != "") {
          let ext: any = attachFiles[i].url.split(".");
          ext = ext[ext.length - 1];
          let fileName = `${loanProfile.loanNo}_${customerName}_${attachFiles[i].docCode}.${ext}`;
          let filePath = `${__dirname}/../../../attach_files/${fileName}`;
          let fileStream: fs.ReadStream = await this.requestUtil.downloadPublicFile(
            attachFiles[i].url,
            filePath
          );
          console.log("fileStream = ", fileStream.path);
          files.push(fileStream.path);
          formData.append(
            attachFiles[i].docCode,
            fs.createReadStream(filePath)
          );
          formData_log[attachFiles[i].docCode] = fileName;
        }
      }
      console.log("call api uploadFile");
      result = await this.requestUtil.uploadFile(
        mafc_api_config.upload.push_to_und_url,
        formData,
        {
          username: mafc_api_config.upload.username,
          password: mafc_api_config.upload.password
        }
      );
      if (result.success) {
        let profile = await this.connection
          .getCustomRepository(LoanProfileRepository)
          .findOne(loanProfile.id);
        if (profile) {
          profile.fvStatus = "SENT_FILES";
          profile.updatedAt = new Date();
          await this.connection
            .getCustomRepository(LoanProfileRepository)
            .save(profile);
        }
      } else {
        isError = true;
      }

      console.log("call api uploadFile result = ", result);
    } catch (e) {
      console.error("call api uploadFile error : " + e);
      result = e;
      isError = true;
    } finally {
      if (files && files.length) {
        files.forEach(async filePath =>
          fs.unlink(filePath, err => {
            if (err) {
              console.error("finally unlink " + filePath + " error = ", err);
            } else {
              console.error("finally unlink success ", filePath);
            }
          })
        );
      }
      let log = new SendDataLog();
      log.apiUrl = "push-to-und";
      log.keyword = formData_log["appid"];
      log.data = JSON.stringify([
        mafc_api_config.upload.push_to_und_url,
        formData_log,
        {
          auth: {
            username: mafc_api_config.upload.username,
            password: mafc_api_config.upload.password
          }
        }
      ]);
      if (isError) {
        log.result = "Error : " + result.message + ". Stack: " + result.stack;
      } else {
        log.result = "API Result : " + JSON.stringify(result);
      }
      log.createdAt = new Date();
      await this.connection
        .getCustomRepository(SendDataLogRepository)
        .save(log);
      if (isError) {
        throw new BadRequestException(log.result);
      }
    }
    return result;
  }

  async test_sendData_pushUnderSystem(loanProfileId: number) {
    try {
      const attachFiles = await this.connection
        .getCustomRepository(AttachFileRepository)
        .find({
          where: {
            deletedAt: IsNull(),
            loanProfileId: loanProfileId
          }
        });
      if (attachFiles && attachFiles.length) {
        const loanProfile = await this.connection
          .getCustomRepository(LoanProfileRepository)
          .findOne(attachFiles[0].loanProfileId);
        if (loanProfile) {
          if (loanProfile.fvStatus == "NEED_UPDATE") {
          } else {
            await this.sendData_pushToUND(
              loanProfile,
              loanProfile.inFname.trim() +
                (loanProfile.inMname && loanProfile.inMname.trim() != ""
                  ? " " + loanProfile.inMname.trim()
                  : "") +
                " " +
                loanProfile.inLname.trim(),
              attachFiles
            );
          }
        }
      }
      return true;
    } catch (e) {
      throw new BadRequestException("lỗi: " + e.message + e.toString());
    }
  }

  async replyDeffers(dtos: LoanProfileDeferReplyRequestDto[]) {
    let defer,
      allReplySuccess = true;
    if (dtos && dtos.length) {
      for (let i = 0; i < dtos.length; i++) {
        if (!dtos[i].defer_id) continue;
        defer = await this.connection
          .getCustomRepository(LoanProfileDeferRepository)
          .findOne({
            where: {
              deletedAt: IsNull(),
              status: "NEW",
              id: dtos[i].defer_id
            }
          });
        let replySuccess = true;
        if (defer) {
          let newReplys = [];
          if (dtos[i].details && dtos[i].details.length) {
            for (let j = 0; j < dtos[i].details.length; j++) {
              let result = await this.sendData_replyDeferUND(
                defer.idF1,
                defer.clientName,
                dtos[i].details[j].doc_code,
                dtos[i].details[j].url,
                i == dtos.length - 1 && j == dtos[i].details.length - 1
                  ? dtos[i].reply_comment
                  : null,
                defer.deferCode,
                i == dtos.length - 1 && j == dtos[i].details.length - 1
                  ? "N"
                  : "Y"
              );
              if (Boolean(result.success) == true) {
                let newReply = new LoanProfileDeferReply();
                newReply.deferId = dtos[i].defer_id;
                newReply.docCode = dtos[i].details[j].doc_code;
                newReply.url = dtos[i].details[j].url;
                newReplys.push(newReply);
              } else {
                replySuccess = false;
                allReplySuccess = false;
              }
            }
          } else {
            let result = await this.sendData_replyDeferUND(
              defer.idF1,
              defer.clientName,
              null,
              null,
              dtos[i].reply_comment,
              defer.deferCode,
              i == dtos.length - 1 ? "N" : "Y"
            );
            if (Boolean(result.success) == true) {
              // let newReply = new LoanProfileDeferReply();
              // newReply.deferId = defer.defer_id;
              // newReply.docCode = defer.doc_code;
              // newReply.url = defer.url;
              // newReplys.push(newReply);
            } else {
              replySuccess = false;
              allReplySuccess = false;
            }
          }
          if (replySuccess) {
            defer.replyComment = dtos[i].reply_comment;
            defer.status = "SENT";
            defer.updatedAt = new Date();
            defer = await this.connection
              .getCustomRepository(LoanProfileDeferRepository)
              .save(defer);
            if (newReplys && newReplys.length) {
              await this.connection
                .getCustomRepository(LoanProfileDeferReplyRepository)
                .save(newReplys);
            }
          } else {
            throw new BadRequestException(
              "Reply defer fail, please try again."
            );
          }
        } else {
          throw new BadRequestException(
            "Cannot find defer " + dtos[0].defer_id
          );
        }
      }
      // update status profile
      if (defer && allReplySuccess) {
        let profile = await this.connection
          .getCustomRepository(LoanProfileRepository)
          .findOne(defer.loanProfileId);
        if (profile) {
          profile.fvStatus = "SENT_DEFER_FILES";
          profile.updatedAt = new Date();
          await this.connection
            .getCustomRepository(LoanProfileRepository)
            .save(profile);
        }
      }
    }
    return true;
  }

  private async sendData_replyDeferUND(
    loanNo: string,
    customerName: string,
    docCode: string,
    url: string,
    comment: string,
    deferCode: string,
    deferStatus: string = "Y"
  ) {
    console.log(
      `sendData_replyDeferUND loanNo=${loanNo},  customerName=${customerName},  docCode=${docCode},  url=${url}, comment=${comment}, deferCode=${deferCode}, deferStatus=${deferStatus}`
    );
    let mafc_api_config = config.get("mafc_api");
    // let download_config = config.get("download");

    console.log("log 1");
    let result: any;
    let isError = false;
    let formData_log;
    let files = [];
    try {
      console.log("log 2");
      formData_log = {};
      formData_log["appid"] = Number(loanNo);
      formData_log["userid"] = "EXT_FIV";
      formData_log["defercode"] = "S1"; //deferCode;
      formData_log["deferstatus"] = deferStatus;
      formData_log["usersname"] = "EXT_FIV";
      formData_log["password"] = "mafc123!";
      formData_log["comment"] = comment;
      console.log("log 3");
      let formData = new FormData();
      console.log("log 4");
      formData.append("appid", loanNo);
      console.log("log 5");
      formData.append("userid", "EXT_FIV");
      console.log("log 6");
      formData.append("defercode", "S1"); //deferCode;
      console.log("log 7");
      formData.append("deferstatus", deferStatus ? deferStatus : "Y");
      console.log("log 8");
      formData.append("usersname", "EXT_FIV");
      console.log("log 9");
      formData.append("password", "mafc123!");
      console.log("log 10");
      formData.append("comment", comment ? comment : "");
      console.log("log 11");
      if (url && docCode) {
        console.log("download file");
        let ext: any = url.split(".");
        ext = ext[ext.length - 1];
        let fileName = `${loanNo}_${customerName}_${docCode}.${ext}`;
        let filePath = `${__dirname}/../../../attach_files/${fileName}`;
        let fileStream: fs.ReadStream = await this.requestUtil.downloadPublicFile(
          url,
          filePath
        );
        console.log("fileStream = ", fileStream.path);
        files.push(fileStream.path);
        formData.append(docCode, fs.createReadStream(filePath));
        formData_log[docCode] = fileName;
      }
      console.log("call api reply-defer-und");
      result = await this.requestUtil.uploadFile(
        mafc_api_config.upload.reply_defer_url,
        formData,
        {
          username: mafc_api_config.upload.username,
          password: mafc_api_config.upload.password
        }
      );

      console.log("call api reply-defer-und result = ", result);
    } catch (e) {
      console.error("call api reply-defer-und error: " + e.message);
      result = e;
      isError = true;
    } finally {
      if (files && files.length) {
        files.forEach(async filePath =>
          fs.unlink(filePath, err => {
            console.log("finally unlink ", err);
          })
        );
      }
      let log = new SendDataLog();
      log.apiUrl = "reply-defer-und";
      log.keyword = formData_log["appid"];
      log.data = JSON.stringify([
        mafc_api_config.upload.reply_defer_url,
        formData_log,
        {
          auth: {
            username: mafc_api_config.upload.username,
            password: mafc_api_config.upload.password
          }
        }
      ]);
      if (isError) {
        log.result = "ERROR:" + result.message;
      } else {
        log.result = JSON.stringify(result);
      }
      log.createdAt = new Date();
      await this.connection
        .getCustomRepository(SendDataLogRepository)
        .save(log);

      // if (isError) {
      //   throw new BadRequestException(log.result);
      // }
    }
    return result;
  }

  private async sendData_dataEntryUpdate(
    oldProfile: LoanProfile,
    updateProfile: LoanProfile,
    dto: LoanProfileDto
  ) {
    let mafc_api_config = config.get("mafc_api");
    let inputDatatUpdateDto = new InputDataUpdateDto();
    let updateResult;
    let hasChange = false;
    let isError = false;
    let apiError = null;
    try {
      inputDatatUpdateDto.in_channel = mafc_api_config.partner_code;
      inputDatatUpdateDto.in_userid = "EXT_FIV"; //dto.in_userid;
      inputDatatUpdateDto.in_appid = oldProfile.loanNo;
      //Đối với trường hợp cập nhật thông tin khoản vay (Scheme , số tiền vay, bảo hiểm, số kỳ thanh toán )
      // , bắt buộc truyền đủ thông tin các trường sau:
      // •	in_schemeid
      // •	in_totalloanamountreq
      // •	in_tenure
      // •	in_laa_app_ins_applicable
      //Nếu không cập nhât thông tin khoản vay, để trống (null) các trường bên trên
      if (
        oldProfile.inSchemeid != updateProfile.inSchemeid ||
        oldProfile.inTotalloanamountreq != updateProfile.inTotalloanamountreq ||
        oldProfile.inTenure != updateProfile.inTenure ||
        oldProfile.inLaaAppInsApplicable != updateProfile.inLaaAppInsApplicable
      ) {
        inputDatatUpdateDto.in_schemeid = updateProfile.inSchemeid;
        inputDatatUpdateDto.in_totalloanamountreq =
          updateProfile.inTotalloanamountreq;
        inputDatatUpdateDto.in_tenure = updateProfile.inTenure;
        inputDatatUpdateDto.in_laa_app_ins_applicable =
          updateProfile.inLaaAppInsApplicable;
        hasChange = true;
      }
      //Đối với cập nhật thông tin khách hàng , Trường nào cần cập nhật thì truyền giá trị ,
      // trường nào không cập nhật thì để trống (null)
      if (
        oldProfile.inFname != updateProfile.inFname ||
        oldProfile.inMname != updateProfile.inMname ||
        oldProfile.inLname != updateProfile.inLname
      ) {
        inputDatatUpdateDto.in_fname = updateProfile.inFname;
        inputDatatUpdateDto.in_mname = updateProfile.inMname;
        inputDatatUpdateDto.in_lname = updateProfile.inLname;
        hasChange = true;
      }
      if (oldProfile.inSalesofficer != updateProfile.inSalesofficer) {
        inputDatatUpdateDto.in_salesofficer = updateProfile.inSalesofficer;
        hasChange = true;
      }
      if (oldProfile.inLoanpurpose != updateProfile.inLoanpurpose) {
        inputDatatUpdateDto.in_loanpurpose = updateProfile.inLoanpurpose;
        hasChange = true;
      }
      if (oldProfile.inPriorityC != updateProfile.inPriorityC) {
        inputDatatUpdateDto.in_priority_c = updateProfile.inPriorityC;
        hasChange = true;
      }
      if (oldProfile.inTitle != updateProfile.inTitle) {
        inputDatatUpdateDto.in_title = updateProfile.inTitle;
        hasChange = true;
      }
      if (oldProfile.inGender != updateProfile.inGender) {
        inputDatatUpdateDto.in_gender = updateProfile.inGender;
        hasChange = true;
      }
      if (oldProfile.inNationalid != updateProfile.inNationalid) {
        inputDatatUpdateDto.in_nationalid = updateProfile.inNationalid;
        hasChange = true;
      }
      if (oldProfile.inDob != updateProfile.inDob) {
        inputDatatUpdateDto.in_dob = updateProfile.inDob;
        hasChange = true;
      }
      if (oldProfile.inTaxCode != updateProfile.inTaxCode) {
        inputDatatUpdateDto.in_tax_code = updateProfile.inTaxCode;
        hasChange = true;
      }
      if (oldProfile.inPresentjobyear != updateProfile.inPresentjobyear) {
        inputDatatUpdateDto.in_presentjobyear = updateProfile.inPresentjobyear;
        hasChange = true;
      }
      if (oldProfile.inPresentjobmth != updateProfile.inPresentjobmth) {
        inputDatatUpdateDto.in_presentjobmth = updateProfile.inPresentjobmth;
        hasChange = true;
      }
      if (oldProfile.inOthers != updateProfile.inOthers) {
        inputDatatUpdateDto.in_others = updateProfile.inOthers;
        hasChange = true;
      }
      if (oldProfile.inPosition != updateProfile.inPosition) {
        inputDatatUpdateDto.in_position = updateProfile.inPosition;
        hasChange = true;
      }
      if (oldProfile.inAmount != updateProfile.inAmount) {
        inputDatatUpdateDto.in_amount = updateProfile.inAmount;
        hasChange = true;
      }
      if (oldProfile.inAccountbank != updateProfile.inAccountbank) {
        inputDatatUpdateDto.in_accountbank = updateProfile.inAccountbank;
        hasChange = true;
      }
      if (oldProfile.inMaritalstatus != updateProfile.inMaritalstatus) {
        inputDatatUpdateDto.in_maritalstatus = updateProfile.inMaritalstatus;
        hasChange = true;
      }
      if (oldProfile.inEduqualify != updateProfile.inEduqualify) {
        inputDatatUpdateDto.in_eduqualify = updateProfile.inEduqualify;
        hasChange = true;
      }
      if (oldProfile.inNoofdependentin != updateProfile.inNoofdependentin) {
        inputDatatUpdateDto.in_noofdependentin =
          updateProfile.inNoofdependentin;
        hasChange = true;
      }
      if (oldProfile.inPaymentchannel != updateProfile.inPaymentchannel) {
        inputDatatUpdateDto.in_paymentchannel = updateProfile.inPaymentchannel;
        hasChange = true;
      }
      if (
        oldProfile.inNationalidissuedate != updateProfile.inNationalidissuedate
      ) {
        inputDatatUpdateDto.in_nationalidissuedate =
          updateProfile.inNationalidissuedate;
        hasChange = true;
      }
      if (oldProfile.inFamilybooknumber != updateProfile.inFamilybooknumber) {
        inputDatatUpdateDto.in_familybooknumber =
          updateProfile.inFamilybooknumber;
        hasChange = true;
      }
      if (oldProfile.inIdissuer != updateProfile.inIdissuer) {
        inputDatatUpdateDto.in_idissuer = updateProfile.inIdissuer;
        hasChange = true;
      }
      if (oldProfile.inSpousename != updateProfile.inSpousename) {
        inputDatatUpdateDto.in_spousename = updateProfile.inSpousename;
        hasChange = true;
      }
      if (oldProfile.inSpouseIdC != updateProfile.inSpouseIdC) {
        inputDatatUpdateDto.in_spouse_id_c = updateProfile.inSpouseIdC;
        hasChange = true;
      }
      // inputDatatUpdateDto.in_categoryid = "FIV";
      if (oldProfile.inBankname != updateProfile.inBankname) {
        inputDatatUpdateDto.in_bankname = updateProfile.inBankname;
        hasChange = true;
      }
      if (oldProfile.inBankbranch != updateProfile.inBankbranch) {
        inputDatatUpdateDto.in_bankbranch = updateProfile.inBankbranch;
        hasChange = true;
      }
      if (oldProfile.inAccno != updateProfile.inAccno) {
        inputDatatUpdateDto.in_accno = updateProfile.inAccno;
        hasChange = true;
      }

      inputDatatUpdateDto.address = [];
      if (dto.address && dto.address.length) {
        dto.address.forEach(item => {
          let address = new InputDataUpdateAddressDto();
          address.in_addresstype = item.address_type;
          address.in_propertystatus = item.property_status;
          address.in_address1stline = item.address_1st_line;
          address.in_country = item.country;
          address.in_city = item.city;
          address.in_district = item.district;
          address.in_ward = item.ward;
          address.in_roomno = item.roomno;
          address.in_mobile = item.mobile;
          address.in_phone = item.fixphone;
          inputDatatUpdateDto.address.push(address);
        });
      }
      if (
        oldProfile.inAddresstype != updateProfile.inAddresstype ||
        oldProfile.inAddressline != updateProfile.inAddressline ||
        oldProfile.inCountry != updateProfile.inCountry ||
        oldProfile.inCity != updateProfile.inCity ||
        oldProfile.inDistrict != updateProfile.inDistrict ||
        oldProfile.inWard != updateProfile.inWard ||
        oldProfile.inPhone != updateProfile.inPhone
      ) {
        let address = new InputDataUpdateAddressDto();
        address.in_addresstype = updateProfile.inAddresstype;
        // address.in_propertystatus = updateProfile.property_status;
        address.in_address1stline = updateProfile.inAddressline;
        address.in_country = updateProfile.inCountry;
        address.in_city = updateProfile.inCity;
        address.in_district = updateProfile.inDistrict;
        address.in_ward = updateProfile.inWard;
        // address.in_roomno = updateProfile.roomno;
        // address.in_mobile = updateProfile.mobile;
        address.in_phone = updateProfile.inPhone;
        inputDatatUpdateDto.address.push(address);
        hasChange = true;
      }
      inputDatatUpdateDto.reference = [];
      if (dto.references && dto.references.length) {
        dto.references.forEach(item => {
          let refer = new InputQdeReferenceDto();
          refer.in_title = item.title;
          refer.in_refereename = item.referee_name;
          refer.in_refereerelation = item.referee_relation;
          refer.in_phone_1 = item.phone_1;
          inputDatatUpdateDto.reference.push(refer);
        });
      }
      // if (!hasChange) {
      //   throw new BadRequestException("No data changed, cannot sent to MAFC");
      // }
      console.log("call api MAFC: ", [
        mafc_api_config.update_data_entry.url,
        inputDatatUpdateDto,
        {
          auth: {
            username: mafc_api_config.update_data_entry.username,
            password: mafc_api_config.update_data_entry.password
          }
        }
      ]);
      updateResult = await this.requestUtil.post(
        mafc_api_config.update_data_entry.url,
        inputDatatUpdateDto,
        {
          auth: {
            username: mafc_api_config.update_data_entry.username,
            password: mafc_api_config.update_data_entry.password
          }
        }
      );
      console.log("updateResult = ", updateResult);
      if (!updateResult.success) {
        isError = false;
        apiError = updateResult;
      }
    } catch (e) {
      console.log(e);
      updateResult = e;
    } finally {
      let log = new SendDataLog();
      log.apiUrl = "update_data_entry";
      log.keyword =
        inputDatatUpdateDto.in_appid +
        (inputDatatUpdateDto.in_nationalid
          ? inputDatatUpdateDto.in_nationalid + "-"
          : "");
      log.data = JSON.stringify([
        mafc_api_config.update_data_entry.url,
        inputDatatUpdateDto,
        {
          auth: {
            username: mafc_api_config.update_data_entry.username,
            password: mafc_api_config.update_data_entry.password
          }
        }
      ]);
      log.result = JSON.stringify(updateResult);
      log.createdAt = new Date();
      await this.connection
        .getCustomRepository(SendDataLogRepository)
        .save(log);
      if (isError) {
        throw new BadRequestException(apiError);
      }
    }
    return updateResult;
  }

  async updateLoanProfile(dto: LoanProfileDto) {
    console.log("updateLoanProfile id = ", dto.id);
    console.log("updateLoanProfile loan_no = ", dto.loan_no);
    // if (!dto.id) {
    //   throw new BadRequestException("Loan profile id can be not null");
    // }
    console.log("updateLoanProfile id = ", dto.id);
    let entityUpdate = this.convertDto2Entity(dto, LoanProfile);
    let entityOld = await this.connection
      .getCustomRepository(LoanProfileRepository)
      .findOne(dto.id);
    this.sendData_dataEntryUpdate(entityOld, entityUpdate, dto);
    switch (entityOld.loanStatus) {
      case "QDE":
        let qdeChangeResult = await this.sendData_procQDEChangeState(
          entityOld.loanNo
        );
        if (!qdeChangeResult.success) {
          throw new BadRequestException(
            qdeChangeResult,
            "error SENT_QDTChangeToDDE"
          );
        }
        entityOld.loanStatus = "DDE";
        let ddeChangeResult = await this.sendData_procDDEChangeState(
          entityOld.loanNo
        );
        if (!ddeChangeResult.success) {
          throw new BadRequestException(
            ddeChangeResult,
            "error SENT_DDEChangeToPOL"
          );
        }
        entityOld.loanStatus = "POL";
        break;
      case "DDE":
      case "BDE":
        let bdeChangeResult = await this.sendData_procDDEChangeState(
          entityOld.loanNo
        );
        if (!bdeChangeResult.success) {
          throw new BadRequestException(
            bdeChangeResult,
            "error SENT_DDEChangeToPOL"
          );
        }
        entityOld.loanStatus = "POL";
        break;
      default:
        throw new BadRequestException(
          "Cannot update for status " + entityOld.loanStatus
        );
    }
    entityUpdate.loanNo = entityOld.loanNo;
    entityUpdate.partnerId = entityOld.partnerId; //MAFC
    entityUpdate.fvStatus = entityOld.fvStatus;
    entityUpdate.loanStatus = entityOld.loanStatus;
    entityUpdate.createdAt = entityOld.createdAt;
    entityUpdate.createdBy = entityOld.createdBy;
    let result = await this.connection
      .getCustomRepository(LoanProfileRepository)
      .save(entityUpdate);
    let addressOld = await this.connection
      .getCustomRepository(AddressRepository)
      .find({
        where: {
          deletedAt: IsNull(),
          loanProfileId: entityOld.id
        }
      });
    if (addressOld && addressOld.length) {
      addressOld.forEach(ao => {
        ao.deletedAt = new Date();
      });
      await this.connection
        .getCustomRepository(AddressRepository)
        .save(addressOld);
    }
    let address = [];
    if (dto.address && dto.address.length) {
      address = this.convertDtos2Entities(dto.address, Address);
      address.forEach(item => {
        item.loanProfileId = entityOld.id;
        item.id = null;
      });
      address = await this.connection
        .getCustomRepository(AddressRepository)
        .save(address);
    }

    let referencesOld = await this.connection
      .getCustomRepository(ReferenceRepository)
      .find({
        where: {
          deletedAt: IsNull(),
          loanProfileId: entityOld.id
        }
      });
    if (referencesOld && referencesOld.length) {
      referencesOld.forEach(ao => {
        ao.deletedAt = new Date();
      });
      await this.connection
        .getCustomRepository(ReferenceRepository)
        .save(referencesOld);
    }
    let references = [];
    if (dto.references && dto.references.length) {
      references = this.convertDtos2Entities(dto.references, Reference);
      references.forEach(item => {
        item.loanProfileId = entityOld.id;
        item.id = null;
      });

      references = await this.connection
        .getCustomRepository(ReferenceRepository)
        .save(references);
    }
    this.logger.verbose(`upadteProfileResult = ${result}`);
    let response: LoanProfileDto = this.convertEntity2Dto(
      result,
      LoanProfile,
      LoanProfileDto
    );
    response.address = this.convertEntities2Dtos(address, Address, AddressDto);
    response.references = this.convertEntities2Dtos(
      references,
      Reference,
      ReferenceDto
    );
    return response;
  }

  async updateAttachFiles(dtos: AttachFileDto[]) {
    if (!dtos[0].id) {
      await this.connection
        .createQueryBuilder()
        .delete()
        .from(AttachFile)
        .where({ loanProfileId: dtos[0].loan_profile_id })
        .execute();
    }
    let entities = this.convertDtos2Entities(dtos, AttachFile);
    let results = await this.connection
      .getCustomRepository(AttachFileRepository)
      .save(entities);
    const attachFiles = await this.connection
      .getCustomRepository(AttachFileRepository)
      .find({
        where: {
          deletedAt: IsNull(),
          loanProfileId: dtos[0].loan_profile_id
        }
      });
    let response: AttachFileDto[] = this.convertEntities2Dtos(
      attachFiles,
      AttachFile,
      AttachFileDto
    );
    if (attachFiles && attachFiles.length) {
      const loanProfile = await this.connection
        .getCustomRepository(LoanProfileRepository)
        .findOne(attachFiles[0].loanProfileId);
      if (loanProfile) {
        if (loanProfile.fvStatus == "NEED_UPDATE") {
        } else {
          await this.sendData_pushToUND(
            loanProfile,
            loanProfile.inFname.trim() +
              (loanProfile.inMname && loanProfile.inMname.trim() != ""
                ? " " + loanProfile.inMname.trim()
                : "") +
              " " +
              loanProfile.inLname.trim(),
            attachFiles
          );
        }
      }
    }
    return response;
  }

  async removeAttachFiles(attchFileId: number, userId) {
    let repo = this.connection.getCustomRepository(AttachFileRepository);
    let entity = await repo.findOne(attchFileId);
    if (entity) {
      entity.deletedAt = new Date();
      entity.deletedBy = userId;
      await repo.save(entity);
      return true;
    } else {
      return false;
    }
  }

  async deleteLoanProfile(loanProfileId: number, userId) {
    let repo = this.connection.getCustomRepository(LoanProfileRepository);
    let entity = await repo.findOne(loanProfileId);
    if (entity) {
      entity.deletedAt = new Date();
      entity.deletedBy = userId;
      entity = await repo.save(entity);
      return true;
    } else {
      return false;
    }
  }

  async checkCustomerInfo(customerNationalId, phone, taxCode = null) {
    let mafc_api_config = config.get("mafc_api");
    let response: any;
    try {
      response = await this.requestUtil.post(
        mafc_api_config.check_customer_info.url,
        {
          cmnd: customerNationalId,
          phone: phone,
          taxCode: taxCode,
          partner: mafc_api_config.partner_code
        },
        {
          auth: {
            username: mafc_api_config.check_customer_info.username,
            password: mafc_api_config.check_customer_info.password
          }
        }
      );
      if (response.success) {
        response.statusCode = 200;
      } else {
        response.statusCode = 400;
      }
    } catch (e) {
      console.error("call api check_customer_info error : " + e);
      response = e.message;
    } finally {
      let log = new SendDataLog();
      log.apiUrl = "check_customer_info";
      log.keyword = customerNationalId + "-" + phone;
      log.data = JSON.stringify([
        mafc_api_config.check_customer_info.url,
        {
          cmnd: customerNationalId,
          phone: phone,
          taxCode: taxCode,
          partner: mafc_api_config.partner_code
        },
        {
          auth: {
            username: mafc_api_config.check_customer_info.username,
            password: mafc_api_config.check_customer_info.password
          }
        }
      ]);
      log.result = JSON.stringify(response);
      log.createdAt = new Date();
      await this.connection
        .getCustomRepository(SendDataLogRepository)
        .save(log);
    }
    return response;
  }

  async checkingS37(customerNationalId) {
    let mafc_api_config = config.get("mafc_api");
    let response: any = await this.requestUtil.post(
      mafc_api_config.cic.url + "/submit-s37",
      {
        idValue: customerNationalId,
        vendorCode: mafc_api_config.partner_code
      },
      {
        auth: {
          username: mafc_api_config.cic.username,
          password: mafc_api_config.cic.password
        }
      }
    );
    if (response.success) {
      response.statusCode = 200;
    } else {
      response.statusCode = 400;
    }
    return response;
  }

  async pollingS37(customerNationalId) {
    let mafc_api_config = config.get("mafc_api");
    let response: any;
    try {
      response = await this.requestUtil.post(
        mafc_api_config.cic.url + "/polling-s37",
        {
          requestId: "",
          idValue: customerNationalId,
          vendorCode: mafc_api_config.partner_code
        },
        {
          auth: {
            username: mafc_api_config.cic.username,
            password: mafc_api_config.cic.password
          }
        }
      );
      if (response.success) {
        response.statusCode = 200;
      } else {
        response.statusCode = 400;
      }
    } catch (e) {
      console.error("call api polling-s37 error : " + e);
      response = e.message;
    } finally {
      let log = new SendDataLog();
      log.apiUrl = "polling-s37";
      log.keyword = customerNationalId;
      log.data = JSON.stringify([
        mafc_api_config.cic.url + "/polling-s37",
        {
          requestId: "",
          idValue: customerNationalId,
          vendorCode: mafc_api_config.partner_code
        },
        {
          auth: {
            username: mafc_api_config.cic.username,
            password: mafc_api_config.cic.password
          }
        }
      ]);
      log.result = JSON.stringify(response);
      log.createdAt = new Date();
      await this.connection
        .getCustomRepository(SendDataLogRepository)
        .save(log);
    }
    return response;
  }
}
