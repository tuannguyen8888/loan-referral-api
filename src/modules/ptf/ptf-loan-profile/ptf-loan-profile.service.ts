import {BadRequestException, Inject, Injectable, Scope} from '@nestjs/common';

import {
    GetPtfLoanProfilesRequestDto,
    LoanProfileResponseDto,
    LoanProfilesResponseDto,
    LoanProfileDto,
    AddressDto,
    EmploymentInformationDto,
    RelatedPersonDto,
    AttachFileDto,
    LoanProfileUpdateDto,
    CreateDeferRequestDto,
    UpdateDeferRequestDto
} from "./dto";
import {BaseService} from "../../../common/services";
import {REQUEST} from "@nestjs/core";
import {Request} from "express";
import {Logger} from "../../../common/loggers";
import {RedisClient} from "../../../common/shared";
import {RequestUtil} from "../../../common/utils";
import {
    PtfAddressRepository,
    PtfLoanProfileRepository,
    SaleGroupRepository,
    PtfEmploymentInformationRepository,
    PtfRelatedPersonRepository,
    PtfAttachFileRepository,
    SendDataLogRepository,
    ProcessRepository,
    PtfLoanProfileDeferRepository
} from "../../../repositories";
import {In, IsNull, Like} from "typeorm";
import * as moment from "moment";
import {
    Address,
    LoanProfile,
    Process,
    PtfAddress,
    PtfAttachFile,
    PtfEmploymentInformation,
    PtfLoanProfile, PtfLoanProfileDefer,
    PtfRelatedPerson, SendDataLog
} from "../../../entities";
import * as FormData from "form-data";
import * as fs from "fs";
import * as config from "config";
import {ProcessDto} from "../../loan-profile/dto";

@Injectable({scope: Scope.REQUEST})
export class PtfLoanProfileService extends BaseService {
    constructor(
        @Inject(REQUEST) protected request: Request,
        protected readonly logger: Logger,
        protected readonly redisClient: RedisClient,
        private readonly requestUtil: RequestUtil
    ) {
        super(request, logger, redisClient);
    }

    async getAllLoanProfiles(dto: GetPtfLoanProfilesRequestDto) {
        try {
            const repo = this.connection.getCustomRepository(PtfLoanProfileRepository);
            let query = repo.createQueryBuilder()
                .where('deleted_at is null');
            if (dto.fv_status)
                query = query.andWhere('fv_status = :fvStatus', {fvStatus: dto.fv_status});
            if (dto.loan_status)
                query = query.andWhere('loan_status = :loanStatus', {loanStatus: dto.loan_status});
            if (dto.keyword)
                query = query.andWhere('loan_application_id like :keyword OR loan_public_id like :keyword OR first_name like :keyword OR middle_name like :keyword OR last_name like :keyword OR id_document_number like :keyword ', {keyword: '%' + dto.keyword + '%'});
            if (dto.user_id) {
                let userGroup = await this.connection
                    .getCustomRepository(SaleGroupRepository)
                    .findOne({
                        where: {
                            deletedAt: IsNull(),
                            email: dto.user_id
                        }
                    });
                if (userGroup) {
                    let userGroups = await this.connection
                        .getCustomRepository(SaleGroupRepository)
                        .find({
                            where: {
                                deletedAt: IsNull(),
                                treePath: Like(`${userGroup.treePath}%`)
                            }
                        });
                    let userEmails = [];
                    if (userGroups && userGroups.length) {
                        userGroups.forEach(ug => userEmails.push(ug.email));
                    }
                    query = query.andWhere('created_by IN (:...userEmails)', {userEmails: userEmails});
                } else {
                    query = query.andWhere('created_by = :userId', {userId: dto.user_id});
                }
                query = query.orderBy('id', 'DESC').skip((dto.page - 1) * dto.pagesize).take(dto.pagesize);
                const result = new LoanProfilesResponseDto();
                let data, count;
                [data, count] = await query.getManyAndCount();
                result.count = count;
                result.rows = this.convertEntities2Dtos(data, PtfLoanProfile, LoanProfileResponseDto);
                return result;
            }
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
            .getCustomRepository(PtfLoanProfileRepository)
            .findOne(loanProfileId);
        let response: LoanProfileResponseDto = this.convertEntity2Dto(
            result,
            PtfLoanProfile,
            LoanProfileResponseDto
        );
        const attachFiles = await this.connection
            .getCustomRepository(PtfAttachFileRepository)
            .find({
                where: {
                    deletedAt: IsNull(),
                    loanProfileId: loanProfileId
                }
            });

        const currentAddress = await this.connection
            .getCustomRepository(PtfAddressRepository)
            .findOne({
                where: {
                    deletedAt: IsNull(),
                    loanProfileId: loanProfileId,
                    addressType: 'CURRES'
                }
            });
        const permanentAddress = await this.connection
            .getCustomRepository(PtfAddressRepository)
            .findOne({
                where: {
                    deletedAt: IsNull(),
                    loanProfileId: loanProfileId,
                    addressType: 'PERMNENT'
                }
            });
        const employmentInformation = await this.connection
            .getCustomRepository(PtfEmploymentInformationRepository)
            .findOne({
                where: {
                    deletedAt: IsNull(),
                    loanProfileId: loanProfileId
                }
            });
        const relatedPersons = await this.connection
            .getCustomRepository(PtfRelatedPersonRepository)
            .find({
                where: {
                    deletedAt: IsNull(),
                    loanProfileId: loanProfileId
                }
            });
        const process = await this.connection
            .getCustomRepository(ProcessRepository)
            .find({
                where: {
                    deletedAt: IsNull(),
                    refTable: 'ptf_loan_profile',
                    loanProfileId: loanProfileId
                }
            });

        response.documentPhoto = this.convertEntities2Dtos(attachFiles, PtfAttachFile, AttachFileDto);
        response.currentAddress = this.convertEntity2Dto(
            currentAddress,
            PtfAddress,
            AddressDto
        );
        response.currentAddress = this.convertEntity2Dto(
            permanentAddress,
            PtfAddress,
            AddressDto
        );
        response.employmentInformation = this.convertEntity2Dto(
            employmentInformation,
            PtfEmploymentInformation,
            EmploymentInformationDto
        );
        response.relatedPersons = this.convertEntities2Dtos(
            relatedPersons,
            PtfRelatedPerson,
            RelatedPersonDto
        );
        response.process = this.convertEntities2Dtos(
            process,
            Process,
            ProcessDto
        );
        return response;
    }

    async checkCustomerInfo(customerNationalId, phone, taxCode = null) {
        let response: any = {
            success: true
        };
        if (response.success) {
            response.statusCode = 200;
        } else {
            response.statusCode = 400;
        }
        return response;
    }

    async createLoanProfile(dto: LoanProfileDto) {
        let ptfApiConfig = config.get("ptf_api");
        let entity: PtfLoanProfile = this.convertDto2Entity(dto, PtfLoanProfile);
        entity.fvStatus = 'NEW';
        entity.partnerId = 3;
        entity.socialAccountType = 1;
        entity.socialAccountDetails = ptfApiConfig.partner_code;
        entity.serviceName = 2;
        entity.iCareLead = 2;
        entity.stateCode = "SA";
        entity.creationDate = moment().format('YYYY-MM-DD');
        entity.disbursementMethod = 1;
        entity.partnerIdCode = 'FinViet';
        entity.createdBy = dto.createdBy;

        this.logger.verbose(`entity = ${JSON.stringify(entity)}`);
        let result = await this.connection
            .getCustomRepository(PtfLoanProfileRepository)
            .save(entity);
        this.logger.verbose(`insertResult = ${result}`);
        let currentAddress: PtfAddress = this.convertDto2Entity(dto.currentAddress, PtfAddress);
        currentAddress.loanProfileId = result.id;
        currentAddress.addressType = 'CURRES';
        let permanentAddress: PtfAddress = this.convertDto2Entity(dto.permanentAddress, PtfAddress);
        permanentAddress.loanProfileId = result.id;
        permanentAddress.addressType = 'PERMNENT';
        let address = await this.connection
            .getCustomRepository(PtfAddressRepository)
            .save([currentAddress, permanentAddress]);
        let employmentInformation: PtfEmploymentInformation = this.convertDto2Entity(dto.employmentInformation, PtfEmploymentInformation);
        employmentInformation.loanProfileId = result.id;
        employmentInformation = await this.connection
            .getCustomRepository(PtfEmploymentInformationRepository)
            .save(employmentInformation);
        let relatedPersons: PtfRelatedPerson[] = this.convertDtos2Entities(dto.relatedPersons, PtfRelatedPerson);
        relatedPersons.forEach(item => item.loanProfileId = result.id);
        relatedPersons = await this.connection
            .getCustomRepository(PtfRelatedPersonRepository)
            .save(relatedPersons);

        let response: LoanProfileDto = this.convertEntity2Dto(
            result,
            PtfLoanProfile,
            LoanProfileDto
        );
        response.currentAddress = this.convertEntity2Dto(
            address[0],
            PtfAddress,
            AddressDto
        );
        response.currentAddress = this.convertEntity2Dto(
            address[1],
            PtfAddress,
            AddressDto
        );
        response.employmentInformation = this.convertEntity2Dto(
            employmentInformation,
            PtfEmploymentInformation,
            EmploymentInformationDto
        );
        response.relatedPersons = this.convertEntities2Dtos(
            relatedPersons,
            PtfRelatedPerson,
            RelatedPersonDto
        );
        return response;
    }

    async updateAttachFiles(dtos: AttachFileDto[]) {
        await this.connection
            .createQueryBuilder()
            .delete()
            .from(PtfAttachFile)
            .where({loanProfileId: dtos[0].loanProfileId})
            .execute();
        let entities: PtfAttachFile[] = this.convertDtos2Entities(dtos, PtfAttachFile);
        let results = await this.connection
            .getCustomRepository(PtfAttachFileRepository)
            .save(entities);
        let loanProfile = await this.connection
            .getCustomRepository(PtfLoanProfileRepository)
            .findOne(dtos[0].loanProfileId);
        if (loanProfile) {
            loanProfile.fvStatus = 'UPLOADED';
            loanProfile = await this.connection
                .getCustomRepository(PtfLoanProfileRepository)
                .save(loanProfile);
        }
        const attachFiles = await this.connection
            .getCustomRepository(PtfAttachFileRepository)
            .find({
                where: {
                    deletedAt: IsNull(),
                    loanProfileId: dtos[0].loanProfileId
                }
            });
        let response: AttachFileDto[] = this.convertEntities2Dtos(
            attachFiles,
            PtfAttachFile,
            AttachFileDto
        );
        if (attachFiles && attachFiles.length) {
            const loanProfile = await this.connection
                .getCustomRepository(PtfLoanProfileRepository)
                .findOne(attachFiles[0].loanProfileId);
            if (loanProfile) {
                if (loanProfile.fvStatus == "NEED_UPDATE") {
                } else {
                    let uploadResults = await this.sendData_uploadDocuments(
                        loanProfile,
                        attachFiles
                    );
                    const currentAddress = await this.connection
                        .getCustomRepository(PtfAddressRepository)
                        .findOne({
                            where: {
                                deletedAt: IsNull(),
                                loanProfileId: loanProfile.id,
                                addressType: 'CURRES'
                            }
                        });
                    const permanentAddress = await this.connection
                        .getCustomRepository(PtfAddressRepository)
                        .findOne({
                            where: {
                                deletedAt: IsNull(),
                                loanProfileId: loanProfile.id,
                                addressType: 'PERMNENT'
                            }
                        });
                    const employmentInformation = await this.connection
                        .getCustomRepository(PtfEmploymentInformationRepository)
                        .findOne({
                            where: {
                                deletedAt: IsNull(),
                                loanProfileId: loanProfile.id
                            }
                        });
                    const relatedPersons = await this.connection
                        .getCustomRepository(PtfRelatedPersonRepository)
                        .find({
                            where: {
                                deletedAt: IsNull(),
                                loanProfileId: loanProfile.id
                            }
                        });
                    await this.sendData_loanRequest(loanProfile, uploadResults, currentAddress, permanentAddress, employmentInformation, relatedPersons);
                }
            }
        }
        return response;
    }

    async updateLoanProfile(dto: LoanProfileUpdateDto) {
        let entityUpdate: PtfLoanProfile = this.convertDto2Entity(dto, PtfLoanProfile);
        entityUpdate.updatedBy = dto.updatedBy;
        entityUpdate.updatedAt = new Date();
        let result = await this.connection
            .getCustomRepository(PtfLoanProfileRepository)
            .save(entityUpdate);
        let address = this.convertDtos2Entities([dto.currentAddress, dto.permanentAddress], PtfAddress);
        address.forEach(item => {
            item.loanProfileId = result.id;
        });
        address = await this.connection
            .getCustomRepository(PtfAddressRepository)
            .save(address);

        let employmentInformation = this.convertDto2Entity(dto.employmentInformation, PtfEmploymentInformation);
        employmentInformation = await this.connection
            .getCustomRepository(PtfEmploymentInformationRepository)
            .save(employmentInformation);

        let relatedPersons = this.convertDtos2Entities(dto.relatedPersons, PtfRelatedPerson);
        relatedPersons = await this.connection
            .getCustomRepository(PtfRelatedPersonRepository)
            .save(relatedPersons);
        const process = await this.connection
            .getCustomRepository(ProcessRepository)
            .find({
                where: {
                    deletedAt: IsNull(),
                    refTable: 'ptf_loan_profile',
                    loanProfileId: result.id
                }
            });

        let response: LoanProfileResponseDto = this.convertEntity2Dto(
            result,
            PtfLoanProfile,
            LoanProfileResponseDto
        );
        response.currentAddress = this.convertEntity2Dto(
            address[0],
            PtfAddress,
            AddressDto
        );
        response.currentAddress = this.convertEntity2Dto(
            address[1],
            PtfAddress,
            AddressDto
        );
        response.employmentInformation = this.convertEntity2Dto(
            employmentInformation,
            PtfEmploymentInformation,
            EmploymentInformationDto
        );
        response.relatedPersons = this.convertEntities2Dtos(
            relatedPersons,
            PtfRelatedPerson,
            RelatedPersonDto
        );
        response.process = this.convertEntities2Dtos(
            process,
            Process,
            ProcessDto
        );
        return response;
    }

    async createDefer(dto: CreateDeferRequestDto){
        let newDefer =  new PtfLoanProfileDefer();
        newDefer.loanProfileId = dto.loanProfileId;
        newDefer.status = 'NEW';
        newDefer.deferCode = dto.deferCode;
        newDefer.deferNote = dto.deferNote;
        newDefer.createdAt = new Date();
        newDefer.createdBy = dto.createdBy;
        await this.connection
            .getCustomRepository(PtfLoanProfileDeferRepository)
            .save(newDefer);
        return true;
    }
    async updateDefer(dto: UpdateDeferRequestDto){
        let updateDefer = await this.connection
            .getCustomRepository(PtfLoanProfileDeferRepository)
            .findOne(dto.id);
        updateDefer.status = 'UPDATED';
        updateDefer.deferReply = dto.deferReply;
        updateDefer.updatedAt = new Date();
        updateDefer.updatedBy = dto.updatedBy;
        await this.connection
            .getCustomRepository(PtfLoanProfileDeferRepository)
            .save(updateDefer);
        return true;
    }

    private async sendData_loanRequest(
        loanProfile: PtfLoanProfile,
        uploadResults: any[],
        currentAddressEntity: PtfAddress,
        permanentAddressEntity: PtfAddress,
        employmentInformationEntity: PtfEmploymentInformation,
        relatedPersonEntities: PtfRelatedPerson[]
    ) {
        let ptfApiConfig = config.get("ptf_api");
        let body, requestConfig, result;
        try {
            let documentPhoto = [];
            if (uploadResults && uploadResults.length)
                uploadResults.forEach((item) => {
                    documentPhoto.push({
                        "document": {
                            "id": item.documentId,
                            "name": item.documentName
                        },
                        "type": item.type
                    });
                });
            let relatedPersons = [];
            if (relatedPersonEntities && relatedPersonEntities.length)
                relatedPersonEntities.forEach((item) => {
                    relatedPersons.push({
                        "relatedPersonType": item.relatedPersonType,
                        "familyName": item.familyName,
                        "middleName": item.middleName,
                        "firstName": item.firstName,
                        "phone": item.phone,
                        "addDate": item.createdAt.toISOString()
                    });
                });
            let clientPhoto = null;
            if (loanProfile.clientPhotoUrl && loanProfile.idDocumentNumber) {
                let resultUpload = await this.sendData_uploadFile(loanProfile.clientPhotoUrl, '1', loanProfile.idDocumentNumber);
                if (resultUpload.status == 'OK') {
                    clientPhoto = {
                        "document": {
                            "id": resultUpload.enquiry.documentId,
                            "name": resultUpload.enquiry.documentName
                        }
                    };
                }
            }
            let employmentInformation = null;
            if (employmentInformationEntity) {
                employmentInformation = {
                    "address": {
                        "houseNumberAndStreet": employmentInformationEntity.houseNumberAndStreet,
                        "cityId": employmentInformationEntity.cityId,
                        "districtId": employmentInformationEntity.districtId,
                        "wardId": employmentInformationEntity.wardId
                    },
                    "economicalStatus": employmentInformationEntity.economicalStatus,
                    "companyUniversityName": employmentInformationEntity.companyUniversityName,
                    "profession": employmentInformationEntity.profession,
                    "employedAtLastWork": employmentInformationEntity.employedAtLastWork,
                    "income": employmentInformationEntity.income,
                    "monthlyPaymentsOtherLoans": employmentInformationEntity.monthlyPaymentsOtherLoans
                };
            }
            body = {
                "command": "GET_ENQUIRY",
                "enquiry": {
                    "authenType": "createLoanApplication",
                    "lastName": loanProfile.lastName,
                    "middleName": loanProfile.middleName,
                    "firstName": loanProfile.firstName,
                    "gender": loanProfile.gender,
                    "birthDate": loanProfile.birthDate,
                    "idDocumentNumber": loanProfile.idDocumentNumber,
                    "idIssueDate": loanProfile.idIssueDate,
                    "idIssueCity": loanProfile.idIssueCity.toString(),
                    "frbDocumentNumber": loanProfile.frbDocumentNumber,
                    "primaryMobile": loanProfile.primaryMobile,
                    "homePhone": loanProfile.homePhone,
                    "secondaryMobile": loanProfile.secondaryMobile,
                    "email": loanProfile.email,
                    "socialAccountType": 1,
                    "socialAccountDetails": ptfApiConfig.partner_code,
                    "maritalStatus": loanProfile.maritalStatus,
                    "accompanimentOfClient": loanProfile.accompanimentOfClient,
                    "numberOfChildren": loanProfile.numberOfChildren,
                    "education": loanProfile.education,
                    "disbursementMethod": loanProfile.disbursementMethod,
                    "accountNumber": loanProfile.accountNumber,
                    "bankNameId": loanProfile.bankNameId,
                    "bankCityId": loanProfile.bankCityId,
                    "bankBranchId": loanProfile.bankBranchId,
                    "bankCode": loanProfile.bankCode,
                    "partnerId": ptfApiConfig.partner_code,
                    "serviceName": 2,
                    "iCareLead": 2,
                    "creationDate": loanProfile.creationDate,
                    "bankBranch": null,
                    "bankCity": null,
                    "bankName": null,
                    "clientPhoto": clientPhoto,
                    "documentPhoto": documentPhoto,
                    "currentAddress": {
                        "houseNumberAndStreet": currentAddressEntity.houseNumberAndStreet,
                        "cityId": currentAddressEntity.cityId,
                        "districtId": currentAddressEntity.districtId,
                        "wardId": currentAddressEntity.wardId
                    },
                    "currentAndPermanentSame": loanProfile.currentAndPermanentSame,
                    "permanentAddress": {
                        "houseNumberAndStreet": permanentAddressEntity.houseNumberAndStreet,
                        "cityId": permanentAddressEntity.cityId,
                        "districtId": permanentAddressEntity.districtId,
                        "wardId": permanentAddressEntity.wardId
                    },
                    "relatedPersons": relatedPersons,
                    "employmentInformation": employmentInformation,
                    "creditProduct": loanProfile.creditProduct,
                    "stateCode": "SA",
                    "amount": loanProfile.amount,
                    "loanPurpose": loanProfile.loanPurpose,
                    "loanTerm": {
                        "value": loanProfile.loanTerm,
                        "periodKind": "Month"
                    }
                }
            };
            requestConfig = {
                "headers": {
                    "reqType": "REQUEST",
                    "api": "PTF_LOAN",
                    "apiKey": "MS0809ZIDANDWYSB2C193VARNAAH",
                    "priority": "3",
                    "channel": "PTF_LOAN",
                    "subChannel": "PTF_LOAN",
                    "location": "localhost",
                    "context": "PC",
                    "trusted": "false",
                    "userID": "1365778600",
                    "requestAPI": "PTF_LOAN",
                    "requestNode": "01",
                    "X-IBM-Client-Secret": ptfApiConfig.X_IBM_Client_Secret,
                    "X-IBM-Client-Id": ptfApiConfig.X_IBM_Client_Id
                }
            };
            console.log("call api PTF: ", [
                ptfApiConfig.loan_request.url,
                body,
                requestConfig
            ]);
            result = await this.requestUtil.post(
                ptfApiConfig.loan_request.url,
                body,
                requestConfig
            );
        } catch (e) {
            console.log(e);
            result = e;
        } finally {
            let log = new SendDataLog();
            log.apiUrl = "loan_request";
            log.data = JSON.stringify([
                ptfApiConfig.loan_request.url,
                body,
                requestConfig
            ]);
            log.result = JSON.stringify(result);
            log.createdAt = new Date();
            await this.connection
                .getCustomRepository(SendDataLogRepository)
                .save(log);
        }
        return result;
    }

    private async sendData_uploadFile(
        url: string,
        type: string,
        idDocumentNumber: string
    ) {
        let ptfApiConfig = config.get("ptf_api");
        let results = [];
        let isError = false;
        let apiError = null;
        let formData_logs = [];
        let files = [];
        try {
            let formData = new FormData();
            let formData_log = {};
            formData_log["productDocumentId"] = type;
            formData_log["idCardNo"] = idDocumentNumber;
            formData.append("productDocumentId", type);
            formData.append("idCardNo", idDocumentNumber);
            let ext: any = url.split(".");
            ext = ext[ext.length - 1];
            let fileName = `${idDocumentNumber}_${type}_${(new Date()).getTime()}.${ext}`;
            let filePath = `${__dirname}/../../attach_files/${fileName}`;
            let fileStream: fs.ReadStream = await this.requestUtil.downloadPublicFile(url, filePath);
            console.log("fileStream = ", fileStream.path);
            files.push(fileStream.path);
            formData.append('file', fs.createReadStream(filePath));
            formData_log['file'] = fileName;

            let log = new SendDataLog();
            formData_logs.push(log);
            log.apiUrl = "uploadFile";
            log.data = JSON.stringify([
                ptfApiConfig.upload.url,
                formData_log,
                null,
                {
                    "X-IBM-Client-Secret": ptfApiConfig.X_IBM_Client_Secret,
                    "X-IBM-Client-Id": ptfApiConfig.X_IBM_Client_Id
                }
            ]);
            log.createdAt = new Date();
            console.log("call api uploadFile");
            let result: any = await this.requestUtil.uploadFile(
                ptfApiConfig.upload.url,
                formData,
                null,
                {
                    "X-IBM-Client-Secret": ptfApiConfig.X_IBM_Client_Secret,
                    "X-IBM-Client-Id": ptfApiConfig.X_IBM_Client_Id
                }
            );
            console.log("call api uploadFile result = ", result);
            log.result = JSON.stringify(result);
            if (result.status == 'OK') {
                result.enquiry.type = type.toString();
                results.push(result);
            } else {
                isError = true;
                apiError = result;
            }
        } catch (e) {
            console.error("call api uploadFile error : " + e);
            formData_logs[formData_logs.length - 1].result = e.message;
            isError = true;
            apiError = e;
        } finally {
            if (files && files.length) {
                files.forEach(async filePath =>
                    fs.unlink(filePath, err => {
                        if (err) {
                            console.error("finally unlink " + filePath + " error = ", err);
                        } else {
                            console.error("finally unlink success ", filePath);
                        }
                    })
                );
            }
            await this.connection
                .getCustomRepository(SendDataLogRepository)
                .save(formData_logs);
            if (isError) {
                throw new BadRequestException(apiError);
            }
        }
        return results[0];
    }

    private async sendData_uploadDocuments(
        loanProfile: PtfLoanProfile,
        attachFiles: PtfAttachFile[]
    ) {
        let ptfApiConfig = config.get("ptf_api");
        let results = [];
        let isError = false;
        let apiError = null;
        let formData_logs = [];
        let files = [];
        try {
            for (let i = 0; i < attachFiles.length; i++) {
                let formData = new FormData();
                let formData_log = {};
                formData_log["productDocumentId"] = attachFiles[i].type;
                formData_log["idCardNo"] = loanProfile.idDocumentNumber;
                formData.append("productDocumentId", attachFiles[i].type);
                formData.append("idCardNo", loanProfile.idDocumentNumber);
                let ext: any = attachFiles[i].url.split(".");
                ext = ext[ext.length - 1];
                let fileName = `${loanProfile.idDocumentNumber}_${attachFiles[i].type}.${ext}`;
                let filePath = `${__dirname}/../../attach_files/${fileName}`;
                let fileStream: fs.ReadStream = await this.requestUtil.downloadPublicFile(
                    attachFiles[i].url,
                    filePath
                );
                console.log("fileStream = ", fileStream.path);
                files.push(fileStream.path);
                formData.append('file', fs.createReadStream(filePath));
                formData_log['file'] = fileName;

                let log = new SendDataLog();
                formData_logs.push(log);
                log.apiUrl = "uploadDocument";
                log.data = JSON.stringify([
                    ptfApiConfig.upload.url,
                    formData_log,
                    null,
                    {
                        "X-IBM-Client-Secret": ptfApiConfig.X_IBM_Client_Secret,
                        "X-IBM-Client-Id": ptfApiConfig.X_IBM_Client_Id
                    }
                ]);
                log.createdAt = new Date();
                console.log("call api uploadFile");
                let result: any = await this.requestUtil.uploadFile(
                    ptfApiConfig.upload.url,
                    formData,
                    null,
                    {
                        "X-IBM-Client-Secret": ptfApiConfig.X_IBM_Client_Secret,
                        "X-IBM-Client-Id": ptfApiConfig.X_IBM_Client_Id
                    }
                );
                console.log("call api uploadFile result = ", result);
                log.result = JSON.stringify(result);
                if (result.status == 'OK') {
                    result.enquiry.type = attachFiles[i].type.toString();
                    results.push(result.enquiry);
                } else {
                    isError = true;
                    apiError = result;
                    break;
                }

            }
            if (!isError) {
                let profile = await this.connection
                    .getCustomRepository(PtfLoanProfileRepository)
                    .findOne(loanProfile.id);
                if (profile) {
                    profile.fvStatus = "SENT_FILES";
                    profile.updatedAt = new Date();
                    await this.connection
                        .getCustomRepository(LoanProfileRepository)
                        .save(profile);
                }
            }
        } catch (e) {
            console.error("call api uploadFile error : " + e);
            formData_logs[formData_logs.length - 1].result = e.message;
            isError = true;
            apiError = e;
        } finally {
            if (files && files.length) {
                files.forEach(async filePath =>
                    fs.unlink(filePath, err => {
                        if (err) {
                            console.error("finally unlink " + filePath + " error = ", err);
                        } else {
                            console.error("finally unlink success ", filePath);
                        }
                    })
                );
            }
            await this.connection
                .getCustomRepository(SendDataLogRepository)
                .save(formData_logs);
            if (isError) {
                throw new BadRequestException(apiError);
            }
        }
        return results;
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
        if (dto.hasOwnProperty('createdAt'))
            dto.createdAt = entity.createdAt
                ? moment(entity.createdAt).format("YYYY-MM-DD HH:mm:ss")
                : null;
        if (dto.hasOwnProperty('updatedAt'))
            dto.updatedAt = entity.updatedAt
                ? moment(entity.updatedAt).format("YYYY-MM-DD HH:mm:ss")
                : null;
        if (dto.hasOwnProperty('deletedAt'))
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
        if (dto.hasOwnProperty('createdAt'))
            entity.createdAt = dto.createdAt ? new Date(dto.createdAt) : null;
        if (dto.hasOwnProperty('updatedAt'))
            entity.updatedAt = dto.updatedAt ? new Date(dto.updatedAt) : null;
        if (dto.hasOwnProperty('deletedAt'))
            entity.deletedAt = dto.deletedAt ? new Date(dto.deletedAt) : null;
        return entity;
    }

    private convertDtos2Entities(dtos, entityClass) {
        let entities = [];
        if (dtos && dtos.length) {
            dtos.forEach(dto =>
                entities.push(this.convertDto2Entity(dto, entityClass))
            );
        }
        return entities;
    }
}
