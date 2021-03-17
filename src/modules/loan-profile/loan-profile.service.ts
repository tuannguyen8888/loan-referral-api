import {Injectable, Scope, Inject, BadRequestException} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {Request} from "express";
import {BaseService} from "../../common/services";
import {Logger} from "../../common/loggers";
import {RedisClient} from "../../common/shared";
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
    InputDdeDto
} from "./dto";
import {
    AddressRepository,
    AttachFileRepository,
    LoanProfileChangeLogRepository,
    LoanProfileDeferRepository,
    LoanProfileRepository,
    ProcessRepository,
    ReferenceRepository,
    SendDataLogRepository
} from "../../repositories";
import {IsNull, Like, Equal} from "typeorm";
import {
    Address,
    AttachFile,
    LoanProfile,
    Process,
    Reference,
    LoanProfileDefer,
    LoanProfileChangeLog,
    SendDataLog
} from "../../entities";
import {RequestUtil} from "../../common/utils";
import * as config from "config";
import {AttachFileDto} from "./dto/attach-file.dto";
import * as moment from "moment";
import {ReferenceDto} from "./dto/reference.dto";
import * as FormData from "form-data";

@Injectable({scope: Scope.REQUEST})
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
        try{
            console.log('getAllLoanProfiles dto = ', dto);
            const repo = this.connection.getCustomRepository(LoanProfileRepository);
            const where = {
                deletedAt: IsNull()
            };
            if (dto.partner_id) {
                where["partnerId"] = dto.partner_id;
            }
            if (dto.fv_status) {
                where["fvStatus"] = Equal(dto.fv_status);
            }
            if (dto.loan_status) {
                where["loanStatus"] = Equal(dto.loan_status);
            }
            if (dto.keyword) {
                where["$or"] = [
                    {inFname: Like(`%${dto.keyword}%`)},
                    {inMname: Like(`%${dto.keyword}%`)},
                    {inLname: Like(`%${dto.keyword}%`)},
                    {inPhone: Like(`%${dto.keyword}%`)},
                    {inNationalid: Like(`%${dto.keyword}%`)},
            ];
            }
            const result = new LoanProfilesResponseDto();
            result.count = await repo.count({where: where});
            result.rows = [];
            if (!dto.sort) {
                dto.sort = {id: -1};
            }
            const options = {
                where: where,
                order: dto.sort,
                skip: (dto.page - 1) * dto.pagesize,
                take: dto.pagesize
            };
            const data = await repo.find(options);
            if (data && data.length) {
                data.forEach(item => {
                    let lp = this.convertEntity2Dto(item, LoanProfile, LoanProfileDto);
                    // lp = Object.assign(lp, item);
                    result.rows.push(lp);
                });
            }
            console.log('result = ', result);
            return result;
        }catch (e) {
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
            .findOneOrFail(loanProfileId);
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
            result.change_logs = this.convertEntities2Dtos(
                changeLogs,
                LoanProfileChangeLog,
                LoanProfileChangeLogDto
            );
            return result;
        } else {
            throw new BadRequestException([
                `loan_profile_id ${loanProfileId} is not exits.`
            ]);
        }
    }

    async createLoanProfile(dto: LoanProfileDto) {
        let qdeResult = await this.sendData_inputQDE(dto);
        console.log("qdeResult = ", qdeResult);
        let entity: LoanProfile = this.convertDto2Entity(dto, LoanProfile);
        if (!qdeResult.success) {
            throw new BadRequestException(qdeResult, 'error SENT_QDE');
        }
        dto.loan_no = qdeResult.data;
        entity.loanNo = qdeResult.data;
        // entity.status = "ACTIVE";
        entity.partnerId = 2; //MAFC
        entity.fvStatus = "SENT_QDE";
        entity.createdAt = new Date();
        let qdeChangeResult = await this.sendData_procQDEChangeState(entity.loanNo);
        if (!qdeChangeResult.success) {
            throw new BadRequestException(qdeChangeResult, 'error SENT_QDTChangeToDDE');
        }
        entity.fvStatus = "SENT_QDTChangeToDDE";
        let ddeResult = await this.sendData_inputDDE(dto);
        if (!ddeResult.success) {
            throw new BadRequestException(ddeResult, 'error SENT_DDE');
        }
        entity.fvStatus = "SENT_DDE";
        let ddeChangeResult = await this.sendData_procDDEChangeState(entity.loanNo);
        if (!ddeChangeResult.success) {
            throw new BadRequestException(ddeChangeResult, 'error SENT_DDEChangeToPOL');
        }
        entity.fvStatus = "SENT_DDEChangeToPOL";

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

    private async sendData_inputQDE(dto: LoanProfileDto) {
        let mafc_api_config = config.get("mafc_api");
        let inputQdeDto = new InputQdeDto();
        let qdeResult;
        try {
            inputQdeDto.in_channel = mafc_api_config.partner_code;
            inputQdeDto.in_schemeid = dto.in_schemeid;
            inputQdeDto.in_downpayment = dto.in_downpayment;
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
            console.log('qdeResult = ', qdeResult);
        } catch (e) {
            console.log(e);
            qdeResult = e;
        } finally {
            let log = new SendDataLog();
            log.apiUrl = "inputQDE";
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

    private async sendData_procQDEChangeState(loanNo: string) {
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
            inputDdeDto.in_categoryid = 'FIV'
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
            log.apiUrl = "inputQDE";
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

    private async sendData_procDDEChangeState(loanNo: string) {
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

    private async sendData_pushUnderSystem(loanNo: string, attachFiles: AttachFile[]) {
        let mafc_api_config = config.get("mafc_api");
        let download_config = config.get("download");
        let result;
        try {
            // console.log("call api MAFC: ", [
            //     mafc_api_config.upload.url,
            //     {
            //         p_appid: Number(loanNo),
            //         in_userid: "EXT_FIV",
            //         in_channel: "FIV",
            //         msgName: "pushUnderSystem"
            //     },
            //     {
            //         auth: {
            //             username: mafc_api_config.upload.username,
            //             password: mafc_api_config.upload.password
            //         }
            //     }
            // ]);
            let formData = new FormData();
            let files = [];
            for (let i = 0; i < attachFiles.length; i++) {
                let file = await this.requestUtil.downloadFile(attachFiles[i].url,download_config.token, download_config.backendUser, '', {});
                files.push(file);
                formData.append(attachFiles[i].docCode,file.data);
            }
            formData.append("warning","N");
            formData.append("warning_msg",null);
            formData.append("appid",Number(loanNo));
            formData.append("salecode","EXT_FIV");
            formData.append("usersname", "EXT_FIV");
            formData.append("password", "mafc123!");
            formData.append("vendor","EXT_FIV");
            let result = await this.requestUtil.uploadFile(
                mafc_api_config.upload.url+'/pushUnderSystem',
                formData,
                {
                    username: mafc_api_config.upload.username,
                    password: mafc_api_config.upload.password
                }

            );
        } catch (e) {
            console.log(e);
            result = e;
        } finally {
            let log = new SendDataLog();
            log.apiUrl = "pushUnderSystem";
            log.data = JSON.stringify([
                mafc_api_config.input_data_entry.url,
                {
                    p_appid: Number(loanNo),
                    in_userid: "EXT_FIV",
                    in_channel: "FIV",
                    msgName: "pushUnderSystem"
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

    async updateLoanProfile(dto: LoanProfileDto) {
        let entity = this.convertDto2Entity(dto, LoanProfile);
        this.logger.verbose(`entity = ${entity}`);
        let result = await this.connection
            .getCustomRepository(LoanProfileRepository)
            .save(entity);
        this.logger.verbose(`insertResult = ${result}`);
        let response = this.convertEntity2Dto(result, LoanProfile, LoanProfileDto);
        return response;
    }

    async updateAttachFiles(dtos: AttachFileDto[]) {
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
        return response;
    }

    async removeAttachFiles(attchFileId: number, userId) {
        let repo = this.connection.getCustomRepository(AttachFileRepository);
        let entity = await repo.findOneOrFail(attchFileId);
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
        let response: any = await this.requestUtil.post(
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
        let response: any = await this.requestUtil.post(
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
        return response;
    }

}
