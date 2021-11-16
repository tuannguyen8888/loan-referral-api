import {HttpService, Inject, Injectable} from '@nestjs/common';
import {BaseService} from "../../../common/services";
import {REQUEST} from "@nestjs/core";
import {Request} from "express";
import {Logger} from "../../../common/loggers";
import {RedisClient} from "../../../common/shared";
import {RequestUtil} from "../../../common/utils";
import {GetMCLoanProfilesRequestDto} from "../../mc/mc-loan-profile/dto";
import {McLoanProfileService} from "../../mc/mc-loan-profile/mc-loan-profile.service";

@Injectable()
export class PartnerLoanProfileService extends BaseService{
    constructor(
        @Inject(REQUEST) protected request: Request,
        protected readonly logger: Logger,
        protected readonly redisClient: RedisClient,
        private readonly requestUtil: RequestUtil,
        @Inject(HttpService) private readonly httpService: HttpService
    ) {
        super(request, logger, redisClient);
        this.serviceMCLoanProfile = new McLoanProfileService(this.request,this.logger,this.redisClient,this.requestUtil,this.httpService);
    }
    private serviceMCLoanProfile;
    async getAllLoanProfiles(dto: GetMCLoanProfilesRequestDto){

    }
}
