import {
    BadRequestException,
    HttpService,
    Inject,
    Injectable,
    Scope
} from "@nestjs/common";
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
import { ProcessDto } from "../../mafc/loan-profile/dto";

import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { Logger } from "../../../common/loggers";
import { RedisClient } from "../../../common/shared";
import { RequestUtil } from "../../../common/utils";
import { McKiosResponseDto } from "../mc-kios/dto";
import { McKiosRepository, SendDataLogRepository } from "../../../repositories";
import { BaseService } from "../../../common/services";
import { McapiUtil } from "../../../common/utils/mcapi.util";

@Injectable()
export class McKiosService extends BaseService {
  constructor(
      @Inject(REQUEST) protected request: Request,
      protected readonly logger: Logger,
      protected readonly redisClient: RedisClient,
      private readonly requestUtil: RequestUtil,
      @Inject(HttpService) private readonly httpService: HttpService
  ) {
    super(request, logger, redisClient);
  }

  async getKios() {
    console.log("Get Kios");
    let mcapi = new McapiUtil(this.redisClient, this.httpService);
    var response = await mcapi.getKios();
    return response;
  }
}
