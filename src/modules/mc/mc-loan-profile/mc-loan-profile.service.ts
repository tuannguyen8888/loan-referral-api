import {BadRequestException, Inject, Injectable, Scope} from "@nestjs/common";

import {
    GetMCLoanProfilesRequestDto,
    LoanProfileResponseDto,
    LoanProfilesResponseDto,
    LoanProfileDto,
    LoanProfileUpdateDto
} from "./dto";
import {BaseService} from "../../../common/services";
import {REQUEST} from "@nestjs/core";
import {Request} from "express";
import {Logger} from "../../../common/loggers";
import {RedisClient} from "../../../common/shared";
import {RequestUtil} from "../../../common/utils";

import * as moment from "moment";
import {McLoanProfile, SendDataLog} from "../../../entities";

import * as config from "config";

import {McLoanProfileRepository} from "../../../repositories/mc/mc-loan-profile.repository";
import {CheckInitContractRequestDto} from "./dto/check-init-contract.request.dto";
import {McCheckListrequestDto} from "./dto/mc-check-listrequest.dto";
import {McapiUtil} from "../../../common/utils/mcapi.util";

@Injectable()
export class McLoanProfileService extends BaseService {
    constructor(
        @Inject(REQUEST) protected request: Request,
        protected readonly logger: Logger,
        protected readonly redisClient: RedisClient,
        private readonly requestUtil: RequestUtil
    ) {
        super(request, logger, redisClient);
    }

    async getAllLoanProfiles(dto: GetMCLoanProfilesRequestDto) {
        try {
            const repo = this.connection.getCustomRepository(McLoanProfileRepository);
            let query = repo.createQueryBuilder().where("deleted_at is null");
            console.log(111);
            if (dto.saleCode)
                query = query.andWhere("saleCode = :saleCode", {
                    saleCode: dto.saleCode
                });
            if (dto.mobileProductType)
                query = query.andWhere("loan_status = :mobileProductType", {
                    loanStatus: dto.mobileProductType
                });
            if (dto.keyword)
                query = query.andWhere(
                    "loan_application_id like :keyword OR loan_public_id like :keyword OR first_name like :keyword OR middle_name like :keyword OR last_name like :keyword OR id_document_number like :keyword ",
                    {keyword: "%" + dto.keyword + "%"}
                );
            query = query
                .orderBy("id", "DESC")
                .skip((dto.page - 1) * dto.pagesize)
                .take(dto.pagesize);
            const result = new LoanProfilesResponseDto();

            let data, count;
            [data, count] = await query.getManyAndCount();
            result.count = count;
            result.rows = this.convertEntities2Dtos(
                data,
                McLoanProfile,
                LoanProfileResponseDto
            );
            return result;
        } catch (e) {
            console.error(e);
            throw e;
        }
        // return new Promise<LoanProfilesResponseDto>(()=>{
        //     return new LoanProfilesResponseDto();
        // });
    }

    async getLoanProfile(loanProfileId: number) {
        let result = await this.connection
            .getCustomRepository(McLoanProfileRepository)
            .findOne(loanProfileId);
        let response: LoanProfileResponseDto = this.convertEntity2Dto(
            result,
            McLoanProfile,
            LoanProfileResponseDto
        );
        return response;
    }

    async checkCIC(citizenId, customerName) {
        console.log(
            "Check cic citizenId: " + citizenId + " customerName: " + customerName
        );
        let mcapi = new McapiUtil();
        var response = await mcapi.checkCIC(citizenId, customerName);
        return response;
    }

    async checkCitizenId(citizenId) {
        console.log("Check cic citizenId: " + citizenId + " customerName: ");
        let mcapi = new McapiUtil();
        var response = await mcapi.checkCitizenId(citizenId);
        return response;
    }

    async checkInitContract(dto: CheckInitContractRequestDto) {
        console.log("checkInitContract");
        let mcapi = new McapiUtil();
        var response = await mcapi.checkInitContract(dto);
        return response;
    }

    async checkList(dto: McCheckListrequestDto) {
        let mc_api_config = config.get("mc_api");
        let response: any;
        try {
            // response = await this.requestUtil.get(
            //     mc_api_config.checkInitContract.url,
            //     {
            //         citizenId: citizenId
            //     },
            //     {
            //         auth: {
            //             username: mc_api_config.checkInitContract.username,
            //             password: mc_api_config.checkInitContract.password
            //         }
            //     }
            // );
            response = {
                checkList: [
                    {
                        groupId: 22,
                        groupName: "CMND/CCCD/CMQĐ",
                        mandatory: 1,
                        hasAlternate: 0,
                        documents: [
                            {
                                id: 4,
                                documentCode: "CivicIdentity",
                                documentName: "CCCD",
                                inputDocUid: "559124662598964b868a210069922848",
                                mapBpmVar: "DOC_CivicIdentity"
                            },
                            {
                                id: 6,
                                documentCode: "IdentityCard",
                                documentName: "CMND",
                                inputDocUid: "943054199583cdc9c54f601005419993",
                                mapBpmVar: "DOC_IdentityCard"
                            },
                            {
                                id: 7,
                                documentCode: "MilitaryIdentity",
                                documentName: "CMQĐ",
                                inputDocUid: "263825031598964c98ee968050949384",
                                mapBpmVar: "DOC_MilitaryIdentity"
                            }
                        ],
                        alternateGroups: []
                    },
                    {
                        groupId: 19,
                        groupName: "Hộ khẩu",
                        mandatory: 1,
                        hasAlternate: 0,
                        documents: [
                            {
                                id: 58,
                                documentCode: "FamilyBook",
                                documentName: "Sổ hộ khẩu",
                                inputDocUid: "964050292583cdc9c56ab88092528583",
                                mapBpmVar: "DOC_FamilyBook"
                            }
                        ],
                        alternateGroups: [[19], [20]]
                    },
                    {
                        groupId: 20,
                        groupName: "Giấy xác nhận cư trú  của thủ trưởng đơn vị",
                        mandatory: 0,
                        hasAlternate: 0,
                        documents: [
                            {
                                id: 17,
                                documentCode: "ResidenceConfirmationOfHeadUnit",
                                documentName: "Giấy xác nhận cư trú của thủ trưởng đơn vị",
                                inputDocUid: "3095960255989637e0f72e6044235226",
                                mapBpmVar: "DOC_ResidenceConfirmationOfHeadUnit"
                            }
                        ],
                        alternateGroups: [[19], [20]]
                    },
                    {
                        groupId: 26,
                        groupName: "Hình ảnh khách hàng",
                        mandatory: 1,
                        hasAlternate: 0,
                        documents: [
                            {
                                id: 23,
                                documentCode: "FacePhoto",
                                documentName: "Hình ảnh khách hàng",
                                inputDocUid: "592712402583cdc9c53fc06001162945",
                                mapBpmVar: "DOC_FacePhoto"
                            }
                        ],
                        alternateGroups: []
                    },
                    {
                        groupId: 23,
                        groupName: "Sổ tạm trú/Thẻ tạm trú/Giấy xác nhận tạm trú",
                        mandatory: 0,
                        hasAlternate: 0,
                        documents: [
                            {
                                id: 18,
                                documentCode: "TemporaryResidenceConfirmation",
                                documentName: "Giấy xác nhận tạm trú",
                                inputDocUid: "5920212035989652c29e694077488644",
                                mapBpmVar: "DOC_TemporaryResidenceConfirmation"
                            },
                            {
                                id: 60,
                                documentCode: "TemporaryResidenceBook",
                                documentName: "Sổ tạm trú",
                                inputDocUid: "316802978583cdc9c553485084790833",
                                mapBpmVar: "DOC_TemporaryResidenceBook"
                            },
                            {
                                id: 63,
                                documentCode: "TemporaryResidenceCard",
                                documentName: "Thẻ tạm trú",
                                inputDocUid: "7592442765989653b86a2e9012732831",
                                mapBpmVar: "DOC_TemporaryResidenceCard"
                            }
                        ],
                        alternateGroups: []
                    },
                    {
                        groupId: 25,
                        groupName: "Giấy CN QSH nhà/ HĐ thế chấp/HĐ mua bán công chứng",
                        mandatory: 0,
                        hasAlternate: 0,
                        documents: [
                            {
                                id: 12,
                                documentCode: "HomeOwnershipCertification",
                                documentName: "Giấy CN QSH nhà",
                                inputDocUid: "80233580159896579000269039042203",
                                mapBpmVar: "DOC_HomeOwnershipCertification"
                            },
                            {
                                id: 20,
                                documentCode: "NotarizedHomeSalesContract",
                                documentName: "HĐ mua bán nhà công chứng",
                                inputDocUid: "183668936598965a22e3031079994157",
                                mapBpmVar: "DOC_NotarizedHomeSalesContract"
                            },
                            {
                                id: 21,
                                documentCode: "HomeMortgageContract",
                                documentName: "HĐ thế chấp nhà",
                                inputDocUid: "9446581325989658bbfea29095214525",
                                mapBpmVar: "DOC_HomeMortgageContract"
                            }
                        ],
                        alternateGroups: []
                    },
                    {
                        groupId: 24,
                        groupName: "Hóa đơn truyền hình cáp/điện/nước/internet/DĐTS/ĐTCĐ",
                        mandatory: 0,
                        hasAlternate: 0,
                        documents: [
                            {
                                id: 25,
                                documentCode: "InternetBill",
                                documentName: "Hóa đơn internet",
                                inputDocUid: "904371149598964fc6ba0c9093658095",
                                mapBpmVar: "DOC_InternetBill"
                            },
                            {
                                id: 28,
                                documentCode: "WaterBill",
                                documentName: "Hóa đơn nước",
                                inputDocUid: "267463210598964e31128a5030554914",
                                mapBpmVar: "DOC_WaterBill"
                            },
                            {
                                id: 29,
                                documentCode: "CableTelevisionBill",
                                documentName: "Hóa đơn truyền hình cáp",
                                inputDocUid: "913116455583cdc9c530207061607496",
                                mapBpmVar: "DOC_CableTelevisionBill"
                            },
                            {
                                id: 30,
                                documentCode: "ElectricBill",
                                documentName: "Hóa đơn điện",
                                inputDocUid: "4601573265989641f868568061200422",
                                mapBpmVar: "DOC_ElectricBill"
                            },
                            {
                                id: 31,
                                documentCode: "HomePhoneBill",
                                documentName: "Hóa đơn điện thoại cố định",
                                inputDocUid: "3506902045989651c778fb0057795362",
                                mapBpmVar: "DOC_HomePhoneBill"
                            },
                            {
                                id: 32,
                                documentCode: "MobilePhoneBill",
                                documentName: "Hóa đơn điện thoại di động trả sau",
                                inputDocUid: "9941625265989650ec321a2049101193",
                                mapBpmVar: "DOC_MobilePhoneBill"
                            }
                        ],
                        alternateGroups: []
                    },
                    {
                        groupId: 28,
                        groupName:
                            "Sao kê tài khoản lương/Xác nhận lương/POI chứng minh thu nhập khác",
                        mandatory: 1,
                        hasAlternate: 0,
                        documents: [
                            {
                                id: 3,
                                documentCode: "BankAccountStatement",
                                documentName: "Bảng kê giao dịch tài khoản ngân hàng",
                                inputDocUid: "736676882598965f5d11f84098472859",
                                mapBpmVar: "DOC_BankAccountStatement"
                            },
                            {
                                id: 47,
                                documentCode: "SalarySlip",
                                documentName: "Phiếu lương/Bảng lương",
                                inputDocUid: "742950439583cdc9c53bd86060933536",
                                mapBpmVar: "DOC_SalarySlip"
                            },
                            {
                                id: 72,
                                documentCode: "OtherProofOfIncome",
                                documentName: "POI chứng minh thu nhập khác",
                                inputDocUid: "21579776659896612966194093479319",
                                mapBpmVar: "DOC_OtherProofOfIncome"
                            },
                            {
                                id: 56,
                                documentCode: "SalaryStatement",
                                documentName: "Sao kê tài khoản lương",
                                inputDocUid: "911509182598965b32f1150071985142",
                                mapBpmVar: "DOC_SalaryStatement"
                            },
                            {
                                id: 69,
                                documentCode: "SalaryConfirmation",
                                documentName: "Xác nhận lương",
                                inputDocUid: "752035783598965d6315f39018877842",
                                mapBpmVar: "DOC_SalaryConfirmation"
                            }
                        ],
                        alternateGroups: [[28, 29], [82]]
                    },
                    {
                        groupId: 29,
                        groupName:
                            "HĐLĐ/Xác nhận công tác/các POI chứng minh công việc khác",
                        mandatory: 1,
                        hasAlternate: 0,
                        documents: [
                            {
                                id: 38,
                                documentCode: "LabourContract",
                                documentName: "Hợp đồng lao động",
                                inputDocUid: "734161376583cdc9c57a586034128239",
                                mapBpmVar: "DOC_LabourContract"
                            },
                            {
                                id: 73,
                                documentCode: "OtherProofOfWork",
                                documentName: "POI chứng minh công việc khác",
                                inputDocUid: "851805737598970874519a8005562217",
                                mapBpmVar: "DOC_OtherProofOfWork"
                            },
                            {
                                id: 76,
                                documentCode: "WorkTransferDecision",
                                documentName: "Quyết định biên chế/quyết định công tác",
                                inputDocUid: "80920760459d4584064d2f6078161136",
                                mapBpmVar: "DOC_WorkTransferDecision"
                            },
                            {
                                id: 53,
                                documentCode: "AppointDecision",
                                documentName: "Quyết định bổ nhiệm",
                                inputDocUid: "771880588598966717399c8071674986",
                                mapBpmVar: "DOC_AppointDecision"
                            },
                            {
                                id: 54,
                                documentCode: "IncreaseSalaryDecision",
                                documentName: "Quyết định nâng lương",
                                inputDocUid: "7269575725989669612b5d4010260337",
                                mapBpmVar: "DOC_IncreaseSalaryDecision"
                            },
                            {
                                id: 55,
                                documentCode: "PromotionDecision",
                                documentName: "Quyết định nâng ngạch, bậc, thăng chức",
                                inputDocUid: "4622057415989668502fc21094914658",
                                mapBpmVar: "DOC_PromotionDecision"
                            },
                            {
                                id: 56,
                                documentCode: "SalaryStatement",
                                documentName: "Sao kê tài khoản lương",
                                inputDocUid: "911509182598965b32f1150071985142",
                                mapBpmVar: "DOC_SalaryStatementOfWork"
                            },
                            {
                                id: 61,
                                documentCode: "HealthInsuranceCard",
                                documentName: "Thẻ bảo hiểm y tế",
                                inputDocUid: "69077565559896631b6de07022743205",
                                mapBpmVar: "DOC_HealthInsuranceCard"
                            },
                            {
                                id: 65,
                                documentCode: "EmployeConfirmation",
                                documentName: "Xác nhận công tác",
                                inputDocUid: "56553729659896645d95924000667619",
                                mapBpmVar: "DOC_EmployeConfirmation"
                            },
                            {
                                id: 69,
                                documentCode: "SalaryConfirmation",
                                documentName: "Xác nhận lương",
                                inputDocUid: "752035783598965d6315f39018877842",
                                mapBpmVar: "DOC_SalaryConfirmationOfWork"
                            }
                        ],
                        alternateGroups: [[28, 29], [82]]
                    },
                    {
                        groupId: 34,
                        groupName: "Phiếu thông tin Khách hàng",
                        mandatory: 1,
                        hasAlternate: 0,
                        documents: [
                            {
                                id: 49,
                                documentCode: "CustomerInformationSheet",
                                documentName: "Phiếu thông tin khách hàng",
                                inputDocUid: "6970134635989643323f1d9054171098",
                                mapBpmVar: "DOC_CustomerInformationSheet"
                            }
                        ],
                        alternateGroups: []
                    },
                    {
                        groupId: 37,
                        groupName: "Hồ sơ khác",
                        mandatory: 0,
                        hasAlternate: 0,
                        documents: [
                            {
                                id: 13,
                                documentCode: "BirthCertificate",
                                documentName: "Giấy khai sinh",
                                inputDocUid: "425720214583cdc9c509104046115087",
                                mapBpmVar: "DOC_BirthCertificate"
                            },
                            {
                                id: 34,
                                documentCode: "Passport",
                                documentName: "Hộ chiếu",
                                inputDocUid: "738875901598968883770b8015189815",
                                mapBpmVar: "DOC_Passport"
                            },
                            {
                                id: 43,
                                documentCode: "Other",
                                documentName: "Khác",
                                inputDocUid: "508837634598971c46bc117081002262",
                                mapBpmVar: "DOC_Other"
                            },
                            {
                                id: 148,
                                documentCode: "paymentBill",
                                documentName: "Phiếu nộp tiền",
                                inputDocUid: null,
                                mapBpmVar: "DOC_paymentBill"
                            },
                            {
                                id: 134,
                                documentCode: "excerptOfMarriage",
                                documentName: "Trích lục kết hôn",
                                inputDocUid: null,
                                mapBpmVar: "excerptOfMarriage"
                            },
                            {
                                id: 70,
                                documentCode: "MarriageCertificate",
                                documentName: "Đăng kí kết hôn",
                                inputDocUid: "967171635598968971dcdd0064707754",
                                mapBpmVar: "DOC_MarriageCertificate"
                            }
                        ],
                        alternateGroups: []
                    },
                    {
                        groupId: 82,
                        groupName: "Sao kê tài khoản lương có tên đơn vị chuyển lương",
                        mandatory: 1,
                        hasAlternate: 0,
                        documents: [
                            {
                                id: 75,
                                documentCode: "SalaryStatementWithPayeeName",
                                documentName:
                                    "Sao kê tài khoản lương có tên đơn vị chuyển lương",
                                inputDocUid: "64184663459d45821b31ab7083460273",
                                mapBpmVar: "DOC_SalaryStatementWithPayeeName"
                            }
                        ],
                        alternateGroups: [[28, 29], [82]]
                    }
                ],
                checkListGroup: [
                    {
                        groups: [19, 20],
                        rules: [[19], [20]]
                    },
                    {
                        groups: [28, 29, 82],
                        rules: [[28, 29], [82]]
                    }
                ]
            };
            response.statusCode = 200;
            // if (response.success) {
            //     response.statusCode = 200;
            // } else {
            //     response.statusCode = 400;
            // }
        } catch (e) {
            console.error("call api checkInitContract error : " + e);
            response = e.message;
        } finally {
        }
        return response;
    }

    async getCategory(companyTaxNumber) {
        let mc_api_config = config.get("mc_api");
        let response: any;
        try {
            // response = await this.requestUtil.get(
            //     mc_api_config.getCategory.url,
            //     {
            //         companyTaxNumber: companyTaxNumber
            //     },
            //     {
            //         auth: {
            //             username: mc_api_config.getCategory.username,
            //             password: mc_api_config.getCategory.password
            //         }
            //     }
            // );
            response = {
                compName: "CÔNG TY TNHH EB CẦN THƠ",
                catType: "CAT B",
                compAddrStreet:
                    "LÔ SỐ 1, KDC HƯNG PHÚ 1, PHƯỜNG HƯNG PHÚ, QUẬN CÁI RĂNG, TP CẦN THƠ",
                officeNumber: "",
                companyTaxNumber: companyTaxNumber
            };
            if (response.success) {
                response.statusCode = 200;
            } else {
                response.statusCode = 400;
            }
        } catch (e) {
            console.error("call api check_customer_info error : " + e);
            response = e.message;
        } finally {
        }
        return response;
    }

    async createLoanProfile(dto: LoanProfileDto) {
        let ptfApiConfig = config.get("ptf_api");
        console.log(dto);
        let entity: McLoanProfile = this.convertDto2Entity(dto, McLoanProfile);
        entity.catType = "NEW";
        entity.mobileProductType = "aaa";
        entity.hasInsurance = 1;
        entity.tempResidence = 1;
        entity.createdBy = dto.createdBy;
        entity.createdAt = new Date();

        this.logger.verbose(`entity = ${JSON.stringify(entity)}`);
        let result = await this.connection
            .getCustomRepository(McLoanProfileRepository)
            .save(entity);
        this.logger.verbose(`insertResult = ${result}`);

        let response: LoanProfileDto = this.convertEntity2Dto(
            result,
            McLoanProfile,
            LoanProfileDto
        );
        return response;
    }

    async updateLoanProfile(dto: LoanProfileUpdateDto) {
        let entityUpdate: McLoanProfile = this.convertDto2Entity(
            dto,
            McLoanProfile
        );
        entityUpdate.updatedBy = dto.updatedBy;
        entityUpdate.updatedAt = new Date();
        let result = await this.connection
            .getCustomRepository(McLoanProfileRepository)
            .save(entityUpdate);
        let response: LoanProfileUpdateDto = this.convertEntity2Dto(
            result,
            McLoanProfile,
            LoanProfileUpdateDto
        );
        return response;
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
        if (dto.hasOwnProperty("createdAt"))
            dto.createdAt = entity.createdAt
                ? moment(entity.createdAt).format("YYYY-MM-DD HH:mm:ss")
                : null;
        if (dto.hasOwnProperty("updatedAt"))
            dto.updatedAt = entity.updatedAt
                ? moment(entity.updatedAt).format("YYYY-MM-DD HH:mm:ss")
                : null;
        if (dto.hasOwnProperty("deletedAt"))
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
        if (dto.hasOwnProperty("createdAt"))
            entity.createdAt = dto.createdAt ? new Date(dto.createdAt) : null;
        if (dto.hasOwnProperty("updatedAt"))
            entity.updatedAt = dto.updatedAt ? new Date(dto.updatedAt) : null;
        if (dto.hasOwnProperty("deletedAt"))
            entity.deletedAt = dto.deletedAt ? new Date(dto.deletedAt) : null;
        return entity;
    }
}
