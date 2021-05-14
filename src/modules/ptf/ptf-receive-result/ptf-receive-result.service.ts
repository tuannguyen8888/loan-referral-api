import {Inject, Injectable, Scope} from "@nestjs/common";
import {BaseService} from "../../../common/services";
import {REQUEST} from "@nestjs/core";
import {Request} from "express";
import {Logger} from "../../../common/loggers";
import {RedisClient} from "../../../common/shared";
import {RequestUtil} from "../../../common/utils";
import {
    PtfAddress,
    PtfEmploymentInformation,
    PtfLoanProfile,
    PtfRelatedPerson,
    SendDataLog
} from "../../../entities";
import {
    PtfLoanProfileRepository,
    SendDataLogRepository
} from "../../../repositories";
import * as config from "config";
import {IsNull, Not} from "typeorm";

@Injectable({scope: Scope.REQUEST})
export class PtfReceiveResultService extends BaseService {
    constructor(
        @Inject(REQUEST) protected request: Request,
        protected readonly logger: Logger,
        protected readonly redisClient: RedisClient,
        private readonly requestUtil: RequestUtil
    ) {
        super(request, logger, redisClient);
    }

    public async getData_loanStatus() {
        console.info("getData_loanStatus");
        let ptfApiConfig = config.get("ptf_api");
        let body, requestConfig;
        try {
            let profiles = await this.connection
                .getCustomRepository(PtfLoanProfileRepository)
                .find({
                    where: {
                        deletedAt: IsNull(),
                        loanPublicId: Not(IsNull()),
                        loanApplicationId: Not(IsNull()),
                        fvStatus: Not("DONE")
                    }
                });
            console.info("profiles count = ", profiles.length);
            requestConfig = {
                headers: {
                    "X-IBM-Client-Secret": ptfApiConfig.X_IBM_Client_Secret,
                    "X-IBM-Client-Id": ptfApiConfig.X_IBM_Client_Id
                }
            };
            if (profiles && profiles.length) {
                for (let i = 0; i < profiles.length; i++) {
                    let loanProfile: PtfLoanProfile = profiles[i];
                    let body, result;
                    try {
                        body = {
                            header: {
                                reqType: "REQUEST",
                                api: "PTF_LOAN",
                                apiKey: "MS0809ZIDANDWYSB2C193VARNAAH",
                                channel: "PTF_LOAN",
                                subChannel: "PTF_LOAN",
                                location: "localhost",
                                context: "PC",
                                trusted: "false",
                                requestAPI: "PTF_LOAN",
                                requestNode: "01",
                                duration: 11163,
                                priority: 3,
                                userID: "1365778600"
                            },
                            body: {
                                command: "GET_ENQUIRY",
                                enquiry:
                                    {
                                        authenType: "getLoanApplicationStatus",
                                        partnerId:
                                        ptfApiConfig.partner_code,
                                        loanApplicationId:
                                        loanProfile.loanApplicationId,
                                        loanPublicId:
                                        loanProfile.loanPublicId
                                    }
                            }
                        };
                        console.log("call api PTF get status: ", [
                            ptfApiConfig.loan_status.url,
                            body,
                            requestConfig
                        ]);
                        let result = await this.requestUtil.post(
                            ptfApiConfig.loan_status.url,
                            body,
                            requestConfig
                        );
                        console.log("result = ", result);
                    } catch (e) {
                        console.log(e);
                        result = e;
                    } finally {
                        let log = new SendDataLog();
                        log.apiUrl = "get_status";
                        log.data = JSON.stringify([
                            ptfApiConfig.loan_status.url,
                            body,
                            requestConfig
                        ]);
                        log.result = JSON.stringify(result);
                        log.createdAt = new Date();
                        await this.connection
                            .getCustomRepository(SendDataLogRepository)
                            .save(log);
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
}
