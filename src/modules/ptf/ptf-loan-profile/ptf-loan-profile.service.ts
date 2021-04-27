import {Inject, Injectable, Scope} from '@nestjs/common';

import {GetPtfLoanProfilesRequestDto, LoanProfileResponseDto, LoanProfilesResponseDto, LoanProfileDto} from "./dto";
import {BaseService} from "../../../common/services";
import {REQUEST} from "@nestjs/core";
import {Request} from "express";
import {Logger} from "../../../common/loggers";
import {RedisClient} from "../../../common/shared";
import {RequestUtil} from "../../../common/utils";
import {LoanProfileRepository, PtfLoanProfileRepository, SaleGroupRepository} from "../../../repositories";
import {In, IsNull, Like} from "typeorm";
import * as moment from "moment";
import {LoanProfile, PtfLoanProfile} from "../../../entities";
@Injectable({ scope: Scope.REQUEST })
export class PtfLoanProfileService extends BaseService {
    constructor(
        @Inject(REQUEST) protected request: Request,
        protected readonly logger: Logger,
        protected readonly redisClient: RedisClient,
        private readonly requestUtil: RequestUtil
    ) {
        super(request, logger, redisClient);
    }

    async getAllLoanProfiles(dto: GetPtfLoanProfilesRequestDto) {
        try {
            const repo = this.connection.getCustomRepository(PtfLoanProfileRepository);
            let query = repo.createQueryBuilder()
                .where('deleted_at is null');
            if(dto.fv_status)
                query = query.andWhere('fv_status = :fvStatus', {fvStatus: dto.fv_status});
            if(dto.loan_status)
                query = query.andWhere('loan_status = :loanStatus', {loanStatus: dto.loan_status});
            if(dto.keyword)
                query = query.andWhere('loan_application_id like :keyword OR loan_public_id like :keyword OR first_name like :keyword OR middle_name like :keyword OR last_name like :keyword OR id_document_number like :keyword ', {keyword: '%'+dto.keyword+'%'});
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
                    query = query.andWhere('created_by IN (:...userEmails)', {userEmails: userEmails});
                } else {
                    query = query.andWhere('created_by = :userId', {userId: dto.user_id});
                }
                query = query.orderBy('id','DESC').skip((dto.page - 1) * dto.pagesize).take(dto.pagesize);
                const result = new LoanProfilesResponseDto();
                let data, count;
                [data,count] = await query.getManyAndCount();
                result.count = count;
                result.rows = this.convertEntities2Dtos(data, PtfLoanProfile, LoanProfileResponseDto);
                return result;
            }
        }catch (e) {
            console.error(e);
            throw e;
        }
        // return new Promise<LoanProfilesResponseDto>(()=>{
        //     return new LoanProfilesResponseDto();
        // });
    }

    async getLoanProfile(loanProfileId: number) {
        return new Promise<LoanProfileResponseDto>(()=>{
            return new LoanProfileResponseDto();
        });
    }

    async checkCustomerInfo(customerNationalId, phone, taxCode = null) {
        let response: any = {
            success: true
        };
        if (response.success) {
            response.statusCode = 200;
        } else {
            response.statusCode = 400;
        }
        return response;
    }

    async createLoanProfile(dto: LoanProfileDto) {
        let entity: PtfLoanProfile = this.convertDto2Entity(dto,PtfLoanProfile);
        this.logger.verbose(`entity = ${JSON.stringify(entity)}`);
        let result = await this.connection
            .getCustomRepository(LoanProfileRepository)
            .save(entity);
        this.logger.verbose(`insertResult = ${result}`);
        let response: LoanProfileDto = this.convertEntity2Dto(
            result,
            PtfLoanProfile,
            LoanProfileDto
        );
        return response;
    }
    async updateLoanProfile(dto: LoanProfileDto) {
        return new Promise<LoanProfileDto>(()=>{
            return new LoanProfileDto();
        });
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
        if(dto.hasOwnProperty('createdAt'))
            dto.createdAt = entity.createdAt
                ? moment(entity.createdAt).format("YYYY-MM-DD HH:mm:ss")
                : null;
        if(dto.hasOwnProperty('updatedAt'))
            dto.updatedAt = entity.updatedAt
                ? moment(entity.updatedAt).format("YYYY-MM-DD HH:mm:ss")
                : null;
        if(dto.hasOwnProperty('deletedAt'))
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
        if(dto.hasOwnProperty('createdAt'))
            entity.createdAt = dto.createdAt ? new Date(dto.createdAt) : null;
        if(dto.hasOwnProperty('updatedAt'))
            entity.updatedAt = dto.updatedAt ? new Date(dto.updatedAt) : null;
        if(dto.hasOwnProperty('deletedAt'))
            entity.deletedAt = dto.deletedAt ? new Date(dto.deletedAt) : null;
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
}
