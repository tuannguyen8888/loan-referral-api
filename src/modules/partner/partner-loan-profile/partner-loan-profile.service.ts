import {HttpService, Inject, Injectable} from '@nestjs/common';
import {BaseService} from "../../../common/services";
import {REQUEST} from "@nestjs/core";
import {Request} from "express";
import {Logger} from "../../../common/loggers";
import {RedisClient} from "../../../common/shared";
import {RequestUtil} from "../../../common/utils";
import {
    GetMCLoanProfilesRequestDto,
    LoanProfileResponseDto,
    LoanProfileUpdateDto,
    McLoanProfileDto
} from "../../mc/mc-loan-profile/dto";
import {McLoanProfileService} from "../../mc/mc-loan-profile/mc-loan-profile.service";
import {McLoanProfileRepository} from "../../../repositories";
import {McLoanProfile} from "../../../entities";
import {PartnerResultResponseDto} from "./dto/partner-result.response.dto";

@Injectable()
export class PartnerLoanProfileService extends BaseService{
    constructor(
        @Inject(REQUEST) protected request: Request,
        protected readonly logger: Logger,
        protected readonly redisClient: RedisClient,
        private readonly requestUtil: RequestUtil,
        @Inject(HttpService) private readonly httpService: HttpService
    ) {
        super(request,logger, redisClient);
    }

    async getAllLoanProfiles(dto: GetMCLoanProfilesRequestDto){
        let response = new PartnerResultResponseDto();
        if(dto.saleCode == undefined || dto.saleCode == ''){
            response.statusCode = 400;
            response.text = 'Không tồn tại salecode!';
            response.data = null;
        }else {
            let serviceMCLoanProfile = new McLoanProfileService(this.request,this.logger,this.redisClient,this.requestUtil,this.httpService);
            let result = await serviceMCLoanProfile.getAllLoanProfiles(dto);
            response.statusCode = 200;
            response.text = '';
            response.data = result;
        }
        return response;
    }
    async getLoanProfile(loanProfileId: number,saleCode:string) {
        let serviceMCLoanProfile = new McLoanProfileService(this.request,this.logger,this.redisClient,this.requestUtil,this.httpService);
        let response = new PartnerResultResponseDto();
        if(saleCode == undefined || saleCode == ''){
            response.statusCode = 400;
            response.text = 'Không tồn tại salecode!';
            response.data = null;
        }else {
            let result = await serviceMCLoanProfile.getLoanProfile(loanProfileId);
            if(result.saleCode == saleCode){
                response.data = result;
            }
            response.statusCode = 200;
            response.text = '';

        }
        return response
    }
    async createLoanProfile(dto: McLoanProfileDto){
        let serviceMCLoanProfile = new McLoanProfileService(this.request,this.logger,this.redisClient,this.requestUtil,this.httpService);
        let response = new PartnerResultResponseDto();
        if(dto.saleCode == undefined || dto.saleCode == ''){
            response.statusCode = 400;
            response.text = 'Không tồn tại salecode!';
            response.data = null;
        }else {
            response.statusCode = 200;
            response.text = '';
            response.data = await serviceMCLoanProfile.createLoanProfile(dto);
        }
        return response

    }
    async updateLoanProfile(dto: LoanProfileUpdateDto) {
        let serviceMCLoanProfile = new McLoanProfileService(this.request,this.logger,this.redisClient,this.requestUtil,this.httpService);
        let response = new PartnerResultResponseDto();
        if(dto.saleCode == undefined || dto.saleCode == ''){
            response.statusCode = 400;
            response.text = 'Không tồn tại salecode!';
            response.data = null;
        }else {
            response.statusCode = 200;
            response.text = '';
            response.data = await serviceMCLoanProfile.updateLoanProfile(dto);
        }
        return response
    }
}
