import {BadRequestException, Inject, Injectable, Scope} from "@nestjs/common";

import {
    GetMCLoanProfilesRequestDto,
    LoanProfileResponseDto,
    LoanProfilesResponseDto,
    LoanProfileDto,
    AddressDto,
    EmploymentInformationDto,
    RelatedPersonDto,
    AttachFileDto,
    LoanProfileUpdateDto,
    CreateDeferRequestDto,
    UpdateDeferRequestDto,
    DeferResponseDto
} from "./dto";
import {BaseService} from "../../../common/services";
import {REQUEST} from "@nestjs/core";
import {Request} from "express";
import {Logger} from "../../../common/loggers";
import {RedisClient} from "../../../common/shared";
import {RequestUtil} from "../../../common/utils";
import {
    PtfAddressRepository,
    PtfLoanProfileRepository,
    SaleGroupRepository,
    PtfEmploymentInformationRepository,
    PtfRelatedPersonRepository,
    PtfAttachFileRepository,
    SendDataLogRepository,
    ProcessRepository,
    PtfLoanProfileDeferRepository
} from "../../../repositories";
import {In, IsNull, Like} from "typeorm";
import * as moment from "moment";
import {
    Address,
    LoanProfile,
    McLoanProfile,
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
import {ProcessDto} from "../../mafc/loan-profile/dto";
import {GetPtfLoanProfilesRequestDto} from "../../ptf/ptf-loan-profile/dto";
import {McLoanProfileRepository} from "../../../repositories/mc/mc-loan-profile.repository";
import {CheckInitContractRequestDto} from "./dto/check-init-contract.request.dto";

@Injectable()
export class McLoanProfileService extends BaseService {
    constructor(
        @Inject(REQUEST) protected request: Request,
        protected readonly logger: Logger,
        protected readonly redisClient: RedisClient,
        private readonly requestUtil: RequestUtil
    ) {
        super(request, logger, redisClient);
    }

    async getAllLoanProfiles(dto: GetMCLoanProfilesRequestDto) {
        try {
            const repo = this.connection.getCustomRepository(McLoanProfileRepository);
            let query = repo.createQueryBuilder().where("deleted_at is null");
            console.log(111);
            if (dto.saleCode)
                query = query.andWhere("saleCode = :saleCode", {
                    saleCode: dto.saleCode
                });
            if (dto.mobileProductType)
                query = query.andWhere("loan_status = :mobileProductType", {
                    loanStatus: dto.mobileProductType
                });
            if (dto.keyword)
                query = query.andWhere(
                    "loan_application_id like :keyword OR loan_public_id like :keyword OR first_name like :keyword OR middle_name like :keyword OR last_name like :keyword OR id_document_number like :keyword ",
                    {keyword: "%" + dto.keyword + "%"}
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
                PtfLoanProfile,
                LoanProfileResponseDto
            );
            return result;
        } catch (e) {
            console.error(e);
            throw e;
        }
        // return new Promise<LoanProfilesResponseDto>(()=>{
        //     return new LoanProfilesResponseDto();
        // });
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

    async checkCIC(citizenID, customerName) {
        console.log('Check cic citizenID: '+citizenID+' customerName: '+customerName)
        let mc_api_config = config.get("mc_api");
        let response: any;
        try {
            // response = await this.requestUtil.get(
            //     mc_api_config.checkCIC.url,
            //     {
            //         citizenID: citizenID,
            //         customerName: customerName
            //     },
            //     {
            //         auth: {
            //             username: mc_api_config.checkCIC.username,
            //             password: mc_api_config.checkCIC.password
            //         }
            //     }
            // );
            response = [
                {
                    "requestId": "1000",
                    "identifier": citizenID,
                    "customerName": customerName,
                    "cicResult": "2",
                    "description": "Đang có dư nợ, đang có nợ cần chú ý",
                    "cicImageLink": "CICS37_CHECKCIC_123456789.PNG",
                    "lastUpdateTime": "06-01-2020 11:31:26",
                    "status": "SUCCESS",
                    "numberOfRelationOrganize": "6"
                }
            ];
            console.log(response);
            if (response.success) {
                response.statusCode = 200;
            } else {
                response.statusCode = 400;
            }
        } catch (e) {
            console.error("call api checkCIC error : " + e);
            response = e.message;
        } finally {
            let log = new SendDataLog();
            log.apiUrl = "checkCIC";
            log.data = JSON.stringify([
                mc_api_config.checkCIC.url,
                {
                    citizenID: citizenID,
                    customerName: customerName
                },
                {
                    auth: {
                        username: mc_api_config.checkCIC.username,
                        password: mc_api_config.checkCIC.password
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

    async checkCitizenId(citizenID) {
        let mc_api_config = config.get("mc_api");
        let response: any;
        try {
            // response = await this.requestUtil.get(
            //     mc_api_config.checkCitizenId.url,
            //     {
            //         citizenID: citizenID
            //     },
            //     {
            //         auth: {
            //             username: mc_api_config.checkCitizenId.username,
            //             password: mc_api_config.checkCitizenId.password
            //         }
            //     }
            // );
            response = {
                "returnCode": "200",
                "returnMes": "CMND đạt điều kiện nhập thông tin"
            };
            response.statusCode = 200;
            // if (response.success) {
            //     response.statusCode = 200;
            // } else {
            //     response.statusCode = 400;
            // }
        } catch (e) {
            console.error("call api checkCitizenId error : " + e);
            response = e.message;
        } finally {
            let log = new SendDataLog();
            log.apiUrl = "checkCitizenId";
            log.data = JSON.stringify([
                mc_api_config.checkCitizenId.url,
                {
                    citizenID: citizenID
                },
                {
                    auth: {
                        username: mc_api_config.checkCitizenId.username,
                        password: mc_api_config.checkCitizenId.password
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
    async checkInitContract(dto: CheckInitContractRequestDto) {
        let mc_api_config = config.get("mc_api");
        let response: any;
        try {
            // response = await this.requestUtil.get(
            //     mc_api_config.checkInitContract.url,
            //     {
            //         citizenID: citizenID
            //     },
            //     {
            //         auth: {
            //             username: mc_api_config.checkInitContract.username,
            //             password: mc_api_config.checkInitContract.password
            //         }
            //     }
            // );
            response = {
                "returnCode": "200",
                "returnMes": "[{\"outputType\":\"RED\",\"outputValue\":\"Dự tính KH có PTI ở mức rủi ro cao, không phù hợp khoản vay\\nĐề nghị giảm Số tiền vay hoặc tăng kỳ hạn vay \"},{\"outputType\":\"RED\",\"outputValue\":\"Dự tính KH có DTI ở mức rủi ro cao, không phù hợp khoản vay\\nĐề nghị giảm Số tiền vay hoặc tăng kỳ hạn vay\"}]"
            };
            response.statusCode = 200;
            // if (response.success) {
            //     response.statusCode = 200;
            // } else {
            //     response.statusCode = 400;
            // }
        } catch (e) {
            console.error("call api checkInitContract error : " + e);
            response = e.message;
        } finally {
            let log = new SendDataLog();
            log.apiUrl = "checkInitContract";
            log.data = JSON.stringify([
                mc_api_config.checkInitContract.url,
                {
                    dto
                },
                {
                    auth: {
                        username: mc_api_config.checkInitContract.username,
                        password: mc_api_config.checkInitContract.password
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
    async getCategory(companyTaxNumber) {
        let mc_api_config = config.get("mc_api");
        let response: any;
        try {
            // response = await this.requestUtil.get(
            //     mc_api_config.getCategory.url,
            //     {
            //         companyTaxNumber: companyTaxNumber
            //     },
            //     {
            //         auth: {
            //             username: mc_api_config.getCategory.username,
            //             password: mc_api_config.getCategory.password
            //         }
            //     }
            // );
            response = {
                "compName": "CÔNG TY TNHH EB CẦN THƠ",
                "catType": "CAT B",
                "compAddrStreet": "LÔ SỐ 1, KDC HƯNG PHÚ 1, PHƯỜNG HƯNG PHÚ, QUẬN CÁI RĂNG, TP CẦN THƠ",
                "officeNumber": "",
                "companyTaxNumber": companyTaxNumber
            };
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
            log.apiUrl = "checkcic";
            log.data = JSON.stringify([
                mc_api_config.getCategory.url,
                {
                    companyTaxNumber: companyTaxNumber
                },
                {
                    auth: {
                        username: mc_api_config.getCategory.username,
                        password: mc_api_config.getCategory.password
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

    async createLoanProfile(dto: LoanProfileDto) {
        let ptfApiConfig = config.get("ptf_api");
        console.log(dto);
        let entity: McLoanProfile = this.convertDto2Entity(dto, McLoanProfile);
        entity.catType = "NEW";
        entity.mobileProductType = "aaa";
        entity.hasInsurance = 1;
        entity.tempResidence = 1;
        entity.createdBy = dto.createdBy;
        entity.createdAt = new Date();

        this.logger.verbose(`entity = ${JSON.stringify(entity)}`);
        let result = await this.connection
            .getCustomRepository(McLoanProfileRepository)
            .save(entity);
        this.logger.verbose(`insertResult = ${result}`);

        let response: LoanProfileDto = this.convertEntity2Dto(
            result,
            McLoanProfile,
            LoanProfileDto
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
