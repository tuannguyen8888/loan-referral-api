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
import { McProductResponseDto } from "../mc-product/dto";
import {
  McProductRepository,
  SendDataLogRepository
} from "../../../repositories";
import { BaseService } from "../../../common/services";

@Injectable()
export class McProductService extends BaseService {
  constructor(
    @Inject(REQUEST) protected request: Request,
    protected readonly logger: Logger,
    protected readonly redisClient: RedisClient,
    private readonly requestUtil: RequestUtil
  ) {
    super(request, logger, redisClient);
  }

  async getProducts() {
    let mc_api_config = config.get("mc_api");
    let response: any;
    try {
      response = [
        {
          id: 54,
          ccy: "VND",
          createdBy: "",
          createdDate: 1539257159000,
          endEffDate: 253402189200000,
          lastUpdatedBy: "",
          lastUpdatedDate: 1539491578000,
          latePenaltyFee: null,
          lateRateIndex: null,
          maxLoanAmount: 60000000,
          maxQuantityCommodities: 1,
          maxTenor: 36,
          minLoanAmount: 10000000,
          minTenor: 6,
          preLiquidationFee: null,
          productCategoryId: 1,
          productCode: "C0000001",
          productGroupId: 13201,
          productName: "CS Bank Acct VIP 37",
          pti: 35,
          rateIndex: 31,
          recordStatus: "A",
          startEffDate: 1509037200000,
          status: "A",
          tenor: null,
          isCheckCat: "0",
          productGroupName: "Cash Loan"
        },
        {
          id: 47,
          ccy: "VND",
          createdBy: "",
          createdDate: 1539257159000,
          endEffDate: 253402189200000,
          lastUpdatedBy: "",
          lastUpdatedDate: 1539491578000,
          latePenaltyFee: null,
          lateRateIndex: null,
          maxLoanAmount: 70000000,
          maxQuantityCommodities: 1,
          maxTenor: 36,
          minLoanAmount: 20000000,
          minTenor: 6,
          preLiquidationFee: null,
          productCategoryId: 1,
          productCode: "C0000003",
          productGroupId: 13201,
          productName: "CS CAT A 37",
          pti: 35,
          rateIndex: 24,
          recordStatus: "A",
          startEffDate: 1507222800000,
          status: "A",
          tenor: null,
          isCheckCat: "0",
          productGroupName: "Cash Loan"
        },
        {
          id: 12,
          ccy: "VND",
          createdBy: "",
          createdDate: 1529980059000,
          endEffDate: 253402189200000,
          lastUpdatedBy: "",
          lastUpdatedDate: 1539491578000,
          latePenaltyFee: null,
          lateRateIndex: null,
          maxLoanAmount: 70000000,
          maxQuantityCommodities: 1,
          maxTenor: 36,
          minLoanAmount: 15000000,
          minTenor: 6,
          preLiquidationFee: null,
          productCategoryId: 3,
          productCode: "C0000004",
          productGroupId: 13202,
          productName: "CS CAT B 45",
          pti: 35,
          rateIndex: 12,
          recordStatus: "A",
          startEffDate: 1481648400000,
          status: "A",
          tenor: null,
          isCheckCat: "0",
          productGroupName: "Installment Loan"
        },
        {
          id: 55,
          ccy: "VND",
          createdBy: "",
          createdDate: 1539257159000,
          endEffDate: 253402189200000,
          lastUpdatedBy: "",
          lastUpdatedDate: 1539491578000,
          latePenaltyFee: null,
          lateRateIndex: null,
          maxLoanAmount: 50000000,
          maxQuantityCommodities: 1,
          maxTenor: 36,
          minLoanAmount: 20000000,
          minTenor: 6,
          preLiquidationFee: null,
          productCategoryId: 1,
          productCode: "C0000005",
          productGroupId: 13201,
          productName: "CS EVN-VIP 37",
          pti: 35,
          rateIndex: 32,
          recordStatus: "A",
          startEffDate: 1509037200000,
          status: "A",
          tenor: null,
          isCheckCat: "0",
          productGroupName: "Cash Loan"
        }
      ];
      console.log(response);
      if (response.success) {
        response.statusCode = 200;
      } else {
        response.statusCode = 400;
      }
    } catch (e) {
      console.error("call api getProduct error : " + e);
      response = e.message;
    } finally {
      let log = new SendDataLog();
      log.apiUrl = "getProduct";
      log.data = JSON.stringify([
        mc_api_config.getProduct.url,
        {},
        {
          auth: {
            username: mc_api_config.getProduct.username,
            password: mc_api_config.getProduct.password
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
