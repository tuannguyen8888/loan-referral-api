import { BadRequestException, Inject, Injectable, Scope } from "@nestjs/common";
import { In, IsNull, Like } from "typeorm";
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

@Injectable()
export class McKiosService extends BaseService {
  constructor(
    @Inject(REQUEST) protected request: Request,
    protected readonly logger: Logger,
    protected readonly redisClient: RedisClient,
    private readonly requestUtil: RequestUtil
  ) {
    super(request, logger, redisClient);
  }

  async getKios() {
    let mc_api_config = config.get("mc_api");
    let response: any;
    try {
      response = [
        {
          id: 1749869,
          kioskCode: "HUB093458",
          kioskAddress: "1636",
          kioskProvince: "HUB093458"
        },
        {
          id: 13127,
          kioskCode: "KIK010001",
          kioskAddress:
            "Số 203 Trần Hưng Đạo - Phường Mỹ Bình - Thành Phố Long Xuyên - An Giang",
          kioskProvince: "AnGiang"
        },
        {
          id: 13147,
          kioskCode: "KIK030001",
          kioskAddress:
            "Tầng 6, Tòa nhà Vietel, ngã tư Minh Khai, phường Hoàng Văn Thụ, T.p Bắc Giang, Tỉnh Bắc Giang",
          kioskProvince: "BacGiang"
        }
      ];
      console.log(response);
      if (response.success) {
        response.statusCode = 200;
      } else {
        response.statusCode = 400;
      }
    } catch (e) {
      console.error("call api getKios error : " + e);
      response = e.message;
    } finally {
      let log = new SendDataLog();
      log.apiUrl = "getKios";
      log.data = JSON.stringify([
        mc_api_config.getKios.url,
        {},
        {
          auth: {
            username: mc_api_config.getKios.username,
            password: mc_api_config.getKios.password
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
