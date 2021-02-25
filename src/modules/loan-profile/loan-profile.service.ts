import { Injectable, Scope, Inject, BadRequestException } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { BaseService } from "../../common/services";
import { Logger } from "../../common/loggers";
import { RedisClient } from "../../common/shared";
import {
  GetLoanProfilesRequestDto,
  LoanProfileDto,
  LoanProfilesResponseDto
} from "./dto";
import { LoanProfileRepository } from "../../repositories";
import { IsNull } from "typeorm";
import { LoanProfile } from "../../entities";

@Injectable({ scope: Scope.REQUEST })
export class LoanProfileService extends BaseService {
  constructor(
    @Inject(REQUEST) protected request: Request,
    protected readonly logger: Logger,
    protected readonly redisClient: RedisClient
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
      where["name"] = name;
    }

    const result = new LoanProfilesResponseDto();
    result.count = await repo.count({ where: where });
    result.rows = [];
    if (!dto.sort) {
      dto.sort = { id: -1 };
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
            .join("") == entityKey.toLowerCase()
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
            .join("") == entityKey.toLowerCase()
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
    let member = await this.connection
      .getCustomRepository(LoanProfileRepository)
      .save(entity);
    this.logger.verbose(`insertResult = ${member}`);
    let response = this.convertEntity2Dto(member);
    return response;
  }

  async updateLoanProfile(dto: LoanProfileDto) {
    let entity = this.convertDto2Entity(dto);
    this.logger.verbose(`entity = ${entity}`);
    let member = await this.connection
      .getCustomRepository(LoanProfileRepository)
      .save(entity);
    this.logger.verbose(`insertResult = ${member}`);
    let response = this.convertEntity2Dto(member);
    return response;
  }

  async deleteLoanProfile(dto: LoanProfileDto) {
    let entity = this.convertDto2Entity(dto);
    this.logger.verbose(`entity = ${entity}`);
    let member = await this.connection
      .getCustomRepository(LoanProfileRepository)
      .save(entity);
    this.logger.verbose(`insertResult = ${member}`);
    let response = this.convertEntity2Dto(member);
    return response;
  }
}
