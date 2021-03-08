import {Injectable, Scope, Inject, BadRequestException} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {Request} from "express";
import {BaseService} from "../../common/services";
import {Logger} from "../../common/loggers";
import {RedisClient} from "../../common/shared";
import {
    GetLoanProfilesRequestDto,
    LoanProfileDto,
    LoanProfilesResponseDto
} from "./dto";
import {
    AddressRepository,
    AttachFileRepository, LoanProfileChangeLogRepository, LoanProfileDeferRepository,
    LoanProfileRepository,
    ProcessRepository,
    ReferenceRepository
} from "../../repositories";
import {IsNull, Like} from "typeorm";
import {AttachFile, LoanProfile} from "../../entities";
import {RequestUtil} from "../../common/utils";
import * as config from "config";
import {AttachFileDto} from "./dto/attach-file.dto";
import * as moment from "moment";

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
        const repo = this.connection.getCustomRepository(LoanProfileRepository);
        const where = {
            deletedAt: IsNull()
        };
        if (dto.partner_id) {
            where["partnerId"] = dto.partner_id;
        }
        if (dto.fv_status) {
            where["fvStatus"] = dto.fv_status;
        }
        if (dto.loan_no) {
            where["loanNo"] = dto.loan_no;
        }
        if (dto.loan_status) {
            where["loanStatus"] = dto.loan_status;
        }
        if (dto.name) {
            where["inFname"] = Like(`%${dto.name}%`);
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
                let lp = this.convertEntity2Dto(item);
                // lp = Object.assign(lp, item);
                result.rows.push(lp);
            });
        }
        return result;
    }

    private convertEntity2Dto(entity) {
        let dto = new LoanProfileDto();
        let dtoKeys = Object.keys(dto);
        let entityKeys = Object.keys(entity);
        for (let dtoKey of dtoKeys) {
            for (let entityKey of entityKeys) {
                if (
                    dtoKey
                        .toLowerCase()
                        .split("_")
                        .join("") == entityKey.toLowerCase().split("_")
                        .join("")
                ) {
                    dto[dtoKey] = entity[entityKey];
                    break;
                }
            }
        }
        dto.created_at = entity.createdAt ? moment(entity.createdAt).format('YYYY-MM-DD HH:mm:ss') : null;
        dto.updated_at = entity.updatedAt ? moment(entity.updatedAt).format('YYYY-MM-DD HH:mm:ss') : null;
        dto.deleted_at = entity.deletedAt ? moment(entity.deletedAt).format('YYYY-MM-DD HH:mm:ss') : null;
        return dto;
    }

    private convertDto2Entity(dto) {
        let entity = new LoanProfile();
        let entityKeys = Object.keys(entity);
        let dtoKeys = Object.keys(dto);
        for (let entityKey of entityKeys) {
            for (let dtoKey of dtoKeys) {
                if (
                    dtoKey
                        .toLowerCase()
                        .split("_")
                        .join("") == entityKey.toLowerCase()
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

    private convertAttachFileEntity2Dto(entity: AttachFile) {
        let dto = new AttachFileDto();
        let dtoKeys = Object.keys(dto);
        let entityKeys = Object.keys(entity);
        for (let dtoKey of dtoKeys) {
            for (let entityKey of entityKeys) {
                if (
                    dtoKey
                        .toLowerCase()
                        .split("_")
                        .join("") == entityKey.toLowerCase()
                ) {
                    dto[dtoKey] = entity[entityKey];
                    break;
                }
            }
        }
        dto.created_at = entity.createdAt ? moment(entity.createdAt).format('YYYY-MM-DD HH:mm:ss') : null;
        dto.updated_at = entity.updatedAt ? moment(entity.updatedAt).format('YYYY-MM-DD HH:mm:ss') : null;
        dto.deleted_at = entity.deletedAt ? moment(entity.deletedAt).format('YYYY-MM-DD HH:mm:ss') : null;
        return dto;
    }
    private convertAttachFileDto2Entity(dto: AttachFileDto) {
        let entity = new AttachFile();
        let entityKeys = Object.keys(entity);
        let dtoKeys = Object.keys(dto);
        for (let entityKey of entityKeys) {
            for (let dtoKey of dtoKeys) {
                if (
                    dtoKey
                        .toLowerCase()
                        .split("_")
                        .join("") == entityKey.toLowerCase()
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

    private convertAttachFileDtos2Entities(dtos: AttachFileDto[]) {
        let entities = [];
        if(dtos && dtos.length){
            dtos.forEach(dto=>entities.push(this.convertAttachFileDto2Entity(dto)));
        }
        return entities;
    }
    private convertAttachFileEntities2Dtos(entities: AttachFile[]) {
        let dtos: AttachFileDto[] = [];
        if(entities && entities.length){
            entities.forEach(entity=>dtos.push(this.convertAttachFileEntity2Dto(entity)));
        }
        return dtos;
    }

    async getLoanProfile(loanProfileId: number) {
        const loanProfile = await this.connection
            .getCustomRepository(LoanProfileRepository)
            .findOneOrFail(loanProfileId);
        if (loanProfile) {
            const address = await this.connection
                .getCustomRepository(AddressRepository)
                .find({where: {
                        deletedAt: IsNull(),
                        loanProfileId: loanProfile.id
                    }});
            const references = await this.connection
                .getCustomRepository(ReferenceRepository)
                .find({where: {
                        deletedAt: IsNull(),
                        loanProfileId: loanProfile.id
                    }});
            const attachFiles = await this.connection
                .getCustomRepository(AttachFileRepository)
                .find({where: {
                        deletedAt: IsNull(),
                        loanProfileId: loanProfile.id
                    }});
            const process = await this.connection
                .getCustomRepository(ProcessRepository)
                .find({where: {
                        deletedAt: IsNull(),
                        loanProfileId: loanProfile.id
                    }});
            const defers = await this.connection
                .getCustomRepository(LoanProfileDeferRepository)
                .find({where: {
                        deletedAt: IsNull(),
                        loanProfileId: loanProfile.id,
                        status: 'NEW'
                    }});
            const changeLogs = await this.connection
                .getCustomRepository(LoanProfileChangeLogRepository)
                .find({where: {
                        deletedAt: IsNull(),
                        loanProfileId: loanProfile.id
                    }});

            let result = this.convertEntity2Dto(loanProfile);
            return result;
        } else {
            throw new BadRequestException([
                `loan_profile_id ${loanProfileId} is not exits.`
            ]);
        }
    }

    async createLoanProfile(dto: LoanProfileDto) {
        let entity = this.convertDto2Entity(dto);
        // entity.status = "ACTIVE";
        let mafc_api_config = config.get("mafc_api");
        entity.partnerId = mafc_api_config.partner_code;
        this.logger.verbose(`entity = ${entity}`);
        let result = await this.connection
            .getCustomRepository(LoanProfileRepository)
            .save(entity);
        this.logger.verbose(`insertResult = ${result}`);
        let response = this.convertEntity2Dto(result);
        return response;
    }

    async updateLoanProfile(dto: LoanProfileDto) {
        let entity = this.convertDto2Entity(dto);
        this.logger.verbose(`entity = ${entity}`);
        let result = await this.connection
            .getCustomRepository(LoanProfileRepository)
            .save(entity);
        this.logger.verbose(`insertResult = ${result}`);
        let response = this.convertEntity2Dto(result);
        return response;
    }
    async updateAttachFiles(dtos: AttachFileDto[]) {
        let entities = this.convertAttachFileDtos2Entities(dtos);
        let results = await this.connection
            .getCustomRepository(AttachFileRepository)
            .save(entities);
        this.logger.verbose(`insertResult = ${results}`);
        let response: AttachFileDto[] = this.convertAttachFileEntities2Dtos(results);
        return response;
    }

    async removeAttachFiles(attchFileId: number, userId) {
        let repo = this.connection.getCustomRepository(AttachFileRepository);
        let entity = await repo.findOneOrFail(attchFileId);
        if(entity){
            entity.deletedAt = new Date();
            entity.deletedBy = userId;
            await repo.save(entity);
            return true;
        }else{
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
        let response = await this.requestUtil.post(
            mafc_api_config.url_check_customer_info,
            {
                cmnd: customerNationalId,
                phone: phone,
                taxCode: taxCode,
                partner: mafc_api_config.partner_code
            },
            {
                auth: {
                    username: mafc_api_config.username,
                    password: mafc_api_config.password
                }
            }
        );
        return response;
    }

    async checkingS37(customerNationalId) {
        let mafc_api_config = config.get("mafc_api");
        let response = await this.requestUtil.post(
            mafc_api_config.cic_url + "/submit-s37",
            {
                id_value: customerNationalId,
                vendor_code: mafc_api_config.partner_code
            },
            {
                auth: {
                    username: mafc_api_config.username,
                    password: mafc_api_config.password
                }
            }
        );
        return response;
    }

    async pollingS37(customerNationalId) {
        let mafc_api_config = config.get("mafc_api");
        let response = await this.requestUtil.post(
            mafc_api_config.cic_url + "/polling-s37",
            {
                request_id: null,
                id_value: customerNationalId,
                vendor_code: mafc_api_config.partner_code
            },
            {
                auth: {
                    username: mafc_api_config.username,
                    password: mafc_api_config.password
                }
            }
        );
        return response;
    }
}
