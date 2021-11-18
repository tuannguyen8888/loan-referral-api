import { HttpService, Inject, Injectable } from "@nestjs/common";
import { BaseService } from "../../../common/services";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { Logger } from "../../../common/loggers";
import { RedisClient } from "../../../common/shared";
import { RequestUtil } from "../../../common/utils";
import {
  GetMCLoanProfilesRequestDto,
  LoanProfileResponseDto,
  LoanProfileUpdateDto,
  McLoanProfileDto
} from "../../mc/mc-loan-profile/dto";
import { McLoanProfileService } from "../../mc/mc-loan-profile/mc-loan-profile.service";
import { McLoanProfileRepository } from "../../../repositories";
import { McLoanProfile } from "../../../entities";
import { PartnerResultResponseDto } from "./dto/partner-result.response.dto";
import { McapiUtil } from "../../../common/utils/mcapi.util";
import { McKiosService } from "../../mc/mc-kios/mc-kios.service";
import { McProductService } from "../../mc/mc-product/mc-product.service";
import { McCheckListrequestDto } from "../../mc/mc-loan-profile/dto/mc-check-listrequest.dto";
import { McAttachfileDto } from "../../mc/mc-attachfile/dto/mc-attachfile.dto";
import { McAttachfileService } from "../../mc/mc-attachfile/mc-attachfile.service";
import { McAttachfileUpdateDto } from "../../mc/mc-attachfile/dto/mc-attachfile.update.dto";
import { GetMCAttachfileRequestDto } from "../../mc/mc-attachfile/dto/mc-get-attachfile.request.dto";
import { McCaseNoteDto } from "../../mc/mc-case-note/dto/mc-case-note.dto";
import { McCaseNoteService } from "../../mc/mc-case-note/mc-case-note.service";
import { requestSendOtp3PDto } from "../../mc/mc-loan-profile/dto/requestSendOtp3P.dto";
import { requestScoring3PDto } from "../../mc/mc-loan-profile/dto/requestScoring3P.dto";
import { GetMcCaseRequestDto } from "../../mc/mc-loan-profile/dto/get-mc-case.request.dto";

@Injectable()
export class PartnerLoanProfileService extends BaseService {
  constructor(
    @Inject(REQUEST) protected request: Request,
    protected readonly logger: Logger,
    protected readonly redisClient: RedisClient,
    private readonly requestUtil: RequestUtil,
    @Inject(HttpService) private readonly httpService: HttpService
  ) {
    super(request, logger, redisClient);
  }

  async getAllLoanProfiles(dto: GetMCLoanProfilesRequestDto) {
    let response = new PartnerResultResponseDto();
    if (dto.saleCode == undefined || dto.saleCode == "") {
      response.statusCode = 400;
      response.message = "Không tồn tại salecode!";
      response.data = null;
    } else {
      let serviceMCLoanProfile = new McLoanProfileService(
        this.request,
        this.logger,
        this.redisClient,
        this.requestUtil,
        this.httpService
      );
      let result = await serviceMCLoanProfile.getAllLoanProfiles(dto);
      response.statusCode = 200;
      response.message = "";
      response.data = result;
    }
    return response;
  }
  async getLoanProfile(loanProfileId: number, saleCode: string) {
    let serviceMCLoanProfile = new McLoanProfileService(
      this.request,
      this.logger,
      this.redisClient,
      this.requestUtil,
      this.httpService
    );
    let response = new PartnerResultResponseDto();
    if (saleCode == undefined || saleCode == "") {
      response.statusCode = 400;
      response.message = "Không tồn tại salecode!";
      response.data = null;
    } else {
      let result = await serviceMCLoanProfile.getLoanProfile(loanProfileId);
      if (result.saleCode == saleCode) {
        response.data = result;
      }
      response.statusCode = 200;
      response.message = "";
    }
    return response;
  }
  async createLoanProfile(dto: McLoanProfileDto) {
    let serviceMCLoanProfile = new McLoanProfileService(
      this.request,
      this.logger,
      this.redisClient,
      this.requestUtil,
      this.httpService
    );
    let response = new PartnerResultResponseDto();
    if (dto.saleCode == undefined || dto.saleCode == "") {
      response.statusCode = 400;
      response.message = "Không tồn tại salecode!";
      response.data = null;
    } else {
      response.statusCode = 200;
      response.message = "";
      response.data = await serviceMCLoanProfile.createLoanProfile(dto);
    }
    return response;
  }
  async updateLoanProfile(dto: LoanProfileUpdateDto) {
    let serviceMCLoanProfile = new McLoanProfileService(
      this.request,
      this.logger,
      this.redisClient,
      this.requestUtil,
      this.httpService
    );
    let response = new PartnerResultResponseDto();
    if (dto.saleCode == undefined || dto.saleCode == "") {
      response.statusCode = 400;
      response.message = "Không tồn tại salecode!";
      response.data = null;
    } else {
      response.statusCode = 200;
      response.message = "";
      response.data = await serviceMCLoanProfile.updateLoanProfile(dto);
    }
    return response;
  }

  //
  async getbpmStatus(saleCode: string) {
    let serviceMCLoanProfile = new McLoanProfileService(
      this.request,
      this.logger,
      this.redisClient,
      this.requestUtil,
      this.httpService
    );
    let response = new PartnerResultResponseDto();
    if (saleCode == undefined || saleCode == "") {
      response.statusCode = 400;
      response.message = "Không tồn tại salecode!";
      response.data = null;
    } else {
      response.statusCode = 200;
      response.message = "";
      response.data = await serviceMCLoanProfile.getbpmStatus();
    }
    return response;
  }
  async checkCIC(saleCode, citizenId, customerName) {
    let serviceMCLoanProfile = new McLoanProfileService(
      this.request,
      this.logger,
      this.redisClient,
      this.requestUtil,
      this.httpService
    );
    let response = new PartnerResultResponseDto();
    if (saleCode == undefined || saleCode == "") {
      response.statusCode = 400;
      response.message = "Không tồn tại salecode!";
      response.data = null;
    } else {
      response.statusCode = 200;
      response.message = "";
      response.data = await serviceMCLoanProfile.checkCIC(
        citizenId,
        customerName
      );
    }
    return response;
  }
  async checkCitizenId(saleCode, citizenId) {
    let serviceMCLoanProfile = new McLoanProfileService(
      this.request,
      this.logger,
      this.redisClient,
      this.requestUtil,
      this.httpService
    );
    let response = new PartnerResultResponseDto();
    if (saleCode == undefined || saleCode == "") {
      response.statusCode = 400;
      response.message = "Không tồn tại salecode!";
      response.data = null;
    } else {
      response.statusCode = 200;
      response.message = "";
      response.data = await serviceMCLoanProfile.checkCitizenId(citizenId);
    }
    return response;
  }
  async checkInitContract(saleCode, loan_profile_id) {
    let serviceMCLoanProfile = new McLoanProfileService(
      this.request,
      this.logger,
      this.redisClient,
      this.requestUtil,
      this.httpService
    );
    let response = new PartnerResultResponseDto();
    if (saleCode == undefined || saleCode == "") {
      response.statusCode = 400;
      response.message = "Không tồn tại salecode!";
      response.data = null;
    } else {
      response.statusCode = 200;
      response.message = "";
      response.data = await serviceMCLoanProfile.checkInitContract(
        loan_profile_id
      );
    }
    return response;
  }

  async checkCategory(saleCode, companyTaxNumber) {
    let serviceMCLoanProfile = new McLoanProfileService(
      this.request,
      this.logger,
      this.redisClient,
      this.requestUtil,
      this.httpService
    );
    let response = new PartnerResultResponseDto();
    if (saleCode == undefined || saleCode == "") {
      response.statusCode = 400;
      response.message = "Không tồn tại salecode!";
      response.data = null;
    } else {
      response.statusCode = 200;
      response.message = "";
      response.data = await serviceMCLoanProfile.checkCategory(
        companyTaxNumber
      );
    }
    return response;
  }

  async getKios(saleCode) {
    let serviceKios = new McKiosService(
      this.request,
      this.logger,
      this.redisClient,
      this.requestUtil,
      this.httpService
    );
    let response = new PartnerResultResponseDto();
    if (saleCode == undefined || saleCode == "") {
      response.statusCode = 400;
      response.message = "Không tồn tại salecode!";
      response.data = null;
    } else {
      response.statusCode = 200;
      response.message = "";
      response.data = await serviceKios.getKios();
    }
    return response;
  }
  async getProducts(saleCode) {
    let serviceProduct = new McProductService(
      this.request,
      this.logger,
      this.redisClient,
      this.requestUtil,
      this.httpService
    );
    let response = new PartnerResultResponseDto();
    if (saleCode == undefined || saleCode == "") {
      response.statusCode = 400;
      response.message = "Không tồn tại salecode!";
      response.data = null;
    } else {
      response.statusCode = 200;
      response.message = "";
      response.data = await serviceProduct.getProducts();
    }
    return response;
  }
  async checkList(saleCode, dto: McCheckListrequestDto) {
    let serviceMCLoanProfile = new McLoanProfileService(
      this.request,
      this.logger,
      this.redisClient,
      this.requestUtil,
      this.httpService
    );
    let response = new PartnerResultResponseDto();
    if (saleCode == undefined || saleCode == "") {
      response.statusCode = 400;
      response.message = "Không tồn tại salecode!";
      response.data = null;
    } else {
      response.statusCode = 200;
      response.message = "";
      response.data = await serviceMCLoanProfile.checkList(dto);
    }
    return response;
  }
  async uploadDocument(saleCode, id) {
    let serviceMCLoanProfile = new McLoanProfileService(
      this.request,
      this.logger,
      this.redisClient,
      this.requestUtil,
      this.httpService
    );
    let response = new PartnerResultResponseDto();
    if (saleCode == undefined || saleCode == "") {
      response.statusCode = 400;
      response.message = "Không tồn tại salecode!";
      response.data = null;
    } else {
      response.statusCode = 200;
      response.message = "";
      response.data = await serviceMCLoanProfile.uploadDocument(id);
    }
    return response;
  }
  async getAllAttachfile(saleCode, dto: GetMCAttachfileRequestDto) {
    let serviceMcAttachfile = new McAttachfileService(
      this.request,
      this.logger,
      this.redisClient,
      this.requestUtil
    );
    let response = new PartnerResultResponseDto();
    if (saleCode == undefined || saleCode == "") {
      response.statusCode = 400;
      response.message = "Không tồn tại salecode!";
      response.data = null;
    } else {
      response.statusCode = 200;
      response.message = "";
      response.data = await serviceMcAttachfile.getAllAttachfile(dto);
    }
    return response;
  }
  async getAttachfile(saleCode, id: number) {
    let serviceMcAttachfile = new McAttachfileService(
      this.request,
      this.logger,
      this.redisClient,
      this.requestUtil
    );
    let response = new PartnerResultResponseDto();
    if (saleCode == undefined || saleCode == "") {
      response.statusCode = 400;
      response.message = "Không tồn tại salecode!";
      response.data = null;
    } else {
      response.statusCode = 200;
      response.message = "";
      response.data = await serviceMcAttachfile.getAttachfile(id);
    }
    return response;
  }
  async createAttachfile(saleCode, dto: McAttachfileDto) {
    let serviceMcAttachfile = new McAttachfileService(
      this.request,
      this.logger,
      this.redisClient,
      this.requestUtil
    );
    let response = new PartnerResultResponseDto();
    if (saleCode == undefined || saleCode == "") {
      response.statusCode = 400;
      response.message = "Không tồn tại salecode!";
      response.data = null;
    } else {
      response.statusCode = 200;
      response.message = "";
      response.data = await serviceMcAttachfile.createAttachfile(dto);
    }
    return response;
  }
  async updateAttachfile(saleCode, dto: McAttachfileUpdateDto) {
    let serviceMcAttachfile = new McAttachfileService(
      this.request,
      this.logger,
      this.redisClient,
      this.requestUtil
    );
    let response = new PartnerResultResponseDto();
    if (saleCode == undefined || saleCode == "") {
      response.statusCode = 400;
      response.message = "Không tồn tại salecode!";
      response.data = null;
    } else {
      response.statusCode = 200;
      response.message = "";
      response.data = await serviceMcAttachfile.updateAttachfile(dto);
    }
    return response;
  }

  async listCaseNote(saleCode, id) {
    let serviceMCLoanProfile = new McLoanProfileService(
      this.request,
      this.logger,
      this.redisClient,
      this.requestUtil,
      this.httpService
    );
    let response = new PartnerResultResponseDto();
    if (saleCode == undefined || saleCode == "") {
      response.statusCode = 400;
      response.message = "Không tồn tại salecode!";
      response.data = null;
    } else {
      response.statusCode = 200;
      response.message = "";
      response.data = await serviceMCLoanProfile.listCaseNote(id);
    }
    return response;
  }

  async createCaseNote(saleCode, dto: McCaseNoteDto) {
    let serviceMcCaseNote = new McCaseNoteService(
      this.request,
      this.logger,
      this.redisClient,
      this.requestUtil,
      this.httpService
    );
    let response = new PartnerResultResponseDto();
    if (saleCode == undefined || saleCode == "") {
      response.statusCode = 400;
      response.message = "Không tồn tại salecode!";
      response.data = null;
    } else {
      response.statusCode = 200;
      response.message = "";
      response.data = await serviceMcCaseNote.createCaseNote(dto);
    }
    return response;
  }

  async requestSendOtp3P(saleCode, dto: requestSendOtp3PDto) {
    let serviceMCLoanProfile = new McLoanProfileService(
      this.request,
      this.logger,
      this.redisClient,
      this.requestUtil,
      this.httpService
    );
    let response = new PartnerResultResponseDto();
    if (saleCode == undefined || saleCode == "") {
      response.statusCode = 400;
      response.message = "Không tồn tại salecode!";
      response.data = null;
    } else {
      response.statusCode = 200;
      response.message = "";
      response.data = await serviceMCLoanProfile.requestSendOtp3P(dto);
    }
    return response;
  }

  async requestScoring3P(saleCode, dto: requestScoring3PDto) {
    let serviceMCLoanProfile = new McLoanProfileService(
      this.request,
      this.logger,
      this.redisClient,
      this.requestUtil,
      this.httpService
    );
    let response = new PartnerResultResponseDto();
    if (saleCode == undefined || saleCode == "") {
      response.statusCode = 400;
      response.message = "Không tồn tại salecode!";
      response.data = null;
    } else {
      response.statusCode = 200;
      response.message = "";
      response.data = await serviceMCLoanProfile.requestScoring3P(dto);
    }
    return response;
  }

  async getCases(saleCode, dto: GetMcCaseRequestDto) {
    let serviceMCLoanProfile = new McLoanProfileService(
      this.request,
      this.logger,
      this.redisClient,
      this.requestUtil,
      this.httpService
    );
    let response = new PartnerResultResponseDto();
    if (saleCode == undefined || saleCode == "") {
      response.statusCode = 400;
      response.message = "Không tồn tại salecode!";
      response.data = null;
    } else {
      response.statusCode = 200;
      response.message = "";
      response.data = await serviceMCLoanProfile.getCases(dto);
    }
    return response;
  }

  async getReturnChecklist(saleCode, id) {
    let serviceMCLoanProfile = new McLoanProfileService(
      this.request,
      this.logger,
      this.redisClient,
      this.requestUtil,
      this.httpService
    );
    let response = new PartnerResultResponseDto();
    if (saleCode == undefined || saleCode == "") {
      response.statusCode = 400;
      response.message = "Không tồn tại salecode!";
      response.data = null;
    } else {
      response.statusCode = 200;
      response.message = "";
      response.data = await serviceMCLoanProfile.getReturnChecklist(id);
    }
    return response;
  }

  async saveFile(file: Express.Multer.File) {
    return await this.requestUtil.saveFile(file);
  }
  getFile(filename) {
    return this.requestUtil.getFile(filename);
  }
}
