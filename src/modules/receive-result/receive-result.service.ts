import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { Logger } from "../../common/loggers";
import { RedisClient } from "../../common/shared";
import { BaseService } from "../../common/services";
import { LoanProfileDto } from "../loan-profile/dto";
import {
  LoanProfileDeferRepository,
  LoanProfileRepository,
  ProcessRepository
} from "../../repositories";
import {
  UploadDeferRequestDto,
  UploadDeferReponseDto,
  UploadStatusF1RequestDto,
  UploadStatusF1ReponseDto
} from "./dto";
import { IsNull } from "typeorm";
import { LoanProfileDefer, Process } from "../../entities";

@Injectable({ scope: Scope.REQUEST })
export class ReceiveResultService extends BaseService {
  constructor(
    @Inject(REQUEST) protected request: Request,
    protected readonly logger: Logger,
    protected readonly redisClient: RedisClient
  ) {
    super(request, logger, redisClient);
  }

  async receiveDefer(dto: UploadDeferRequestDto) {
    let repoLP = this.connection.getCustomRepository(LoanProfileRepository);
    let loanProfile = await repoLP.findOne({
      where: {
        deletedAt: IsNull(),
        loanNo: dto.id_f1.toString()
      }
    });
    let response = new UploadDeferReponseDto();
    response.data = dto;
    if (loanProfile) {
      if(dto.defer_code != "S1") {
          loanProfile.fvStatus = "NEED_UPDATE";
          loanProfile = await repoLP.save(loanProfile);
      }

      let newDefer = new LoanProfileDefer();
      newDefer.loanProfileId = loanProfile.id;
      newDefer.idF1 = dto.id_f1.toString();
      newDefer.clientName = dto.client_name;
      newDefer.deferCode = dto.defer_code;
      newDefer.deferNote = dto.defer_note;
      newDefer.deferTime = new Date(dto.defer_time);
      newDefer.status = dto.defer_code == "S1" ? "RECEIVED" : "NEW";
      newDefer.createdAt = new Date();
      newDefer = await this.connection
        .getCustomRepository(LoanProfileDeferRepository)
        .save(newDefer);

      let newProcess = new Process();
      newProcess.loanProfileId = loanProfile.id;
      newProcess.processStatus = "RECEIVE_DEFER";
      newProcess.description = dto.defer_note;
      newProcess.refTable = "loan_profile_defer";
      newProcess.idRef = newDefer.id;
      newProcess.createdAt = new Date();
      await this.connection
        .getCustomRepository(ProcessRepository)
        .save(newProcess);
      response.status = "SUCCESS";
    } else {
      response.status = "ERROR";
      response.message = "id_f1 " + dto.id_f1 + " does not exist";
    }
    return response;
  }

  async receiveStatus(dtos: UploadStatusF1RequestDto[]) {
    let response = [];
    let repoLP = this.connection.getCustomRepository(LoanProfileRepository);
    if (dtos && dtos.length) {
      for (let i = 0; i < dtos.length; i++) {
        let dto = dtos[i];
        let loanProfile = await repoLP.findOne({
          where: {
            deletedAt: IsNull(),
            loanNo: dto.id_f1.toString()
          }
        });
        let responseItem = new UploadStatusF1ReponseDto();
        responseItem.data = dto;
        if (loanProfile) {
          loanProfile.loanStatus = dto.status_f1;
          loanProfile = await repoLP.save(loanProfile);

          let newProcess = new Process();
          newProcess.loanProfileId = loanProfile.id;
          newProcess.processStatus = "RECEIVE_STATUS";
          newProcess.description =
            dto.status_f1 +
            (dto.reason || dto.rejected_code
              ? " " + dto.reason + "[" + dto.rejected_code + "]"
              : "");
          newProcess.refTable = "loan_profile";
          newProcess.idRef = loanProfile.id;
          newProcess.createdAt = new Date();
          await this.connection
            .getCustomRepository(ProcessRepository)
            .save(newProcess);
          responseItem.status = "SUCCESS";
        } else {
          responseItem.status = "ERROR";
          responseItem.message = "id_f1 " + dto.id_f1 + " does not exist";
        }
        response.push(responseItem);
      }
    }
    return response;
  }
}
