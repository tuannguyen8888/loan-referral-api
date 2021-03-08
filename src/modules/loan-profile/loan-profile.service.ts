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
    AttachFileRepository,
    LoanProfileRepository,
    ProcessRepository,
    ReferenceRepository
} from "../../repositories";
import {IsNull, Like} from "typeorm";
import {LoanProfile} from "../../entities";
import {RequestUtil} from "../../common/utils";
import * as config from "config";

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
                        .join("") == entityKey.toLowerCase().split("_")
                        .join("")
                ) {
                    entity[entityKey] = dto[dtoKey];
                    break;
                }
            }
        }
        return entity;
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
