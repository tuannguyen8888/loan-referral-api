import { HttpService, Inject, Injectable } from "@nestjs/common";
import * as config from "config";
import { CheckInitContractRequestDto } from "../../modules/mc/mc-loan-profile/dto/check-init-contract.request.dto";
import { RedisClient } from "../shared";
import fs from "fs";
import { RequestUtil } from "./request.util";
import { McLoanProfile, SendDataLog } from "../../entities";
import {
  LoanProfileResponseDto,
  McLoanProfileDto
} from "../../modules/mc/mc-loan-profile/dto";
import { McAttachfilesResponseDto } from "../../modules/mc/mc-attachfile/dto/mc-attachfiles.response.dto";
import { GetMcCaseRequestDto } from "../../modules/mc/mc-loan-profile/dto/get-mc-case.request.dto";
import { requestScoring3PDto } from "../../modules/mc/mc-loan-profile/dto/requestScoring3P.dto";
import { urlencoded } from "express";
import {
  McLoanProfileRepository,
  SendDataLogRepository
} from "../../repositories";
import { Connection, getConnectionManager } from "typeorm";
import { McCheckListrequestDto } from "../../modules/mc/mc-loan-profile/dto/mc-check-listrequest.dto";

@Injectable()
export class McapiUtil {
  constructor(
    protected readonly redisClient: RedisClient,
    @Inject(HttpService) private readonly httpService: HttpService
  ) {
    this.connection = getConnectionManager().get("default");
  }

  protected connection: Connection;

  async login(): Promise<any> {
    let mc_api_config = config.get("mc_api");
    var axios = require("axios");
    var data = JSON.stringify({
      username: mc_api_config.username,
      password: mc_api_config.password,
      notificationId: mc_api_config.notificationId,
      imei: mc_api_config.imei,
      osType: mc_api_config.osType
    });
    let url = mc_api_config.endpoint + "authorization/";
    let headers = {
      "Content-Type": "application/json",
      "x-security": mc_api_config.security
    };

    let result = await axios.post(url, data, {
      headers: headers
    });
    //console.log(result.data);
    await this.redisClient.set("token", result.data.token);
    return result.data;
  }

  async loginCron(): Promise<any> {
    let mc_api_config = config.get("mc_api");
    var axios = require("axios");
    var data = JSON.stringify({
      username: mc_api_config.username,
      password: mc_api_config.password,
      notificationId: mc_api_config.notificationId,
      imei: mc_api_config.imei,
      osType: mc_api_config.osType
    });
    let url = mc_api_config.endpoint + "authorization/";
    let headers = {
      "Content-Type": "application/json",
      "x-security": mc_api_config.security
    };

    let result = await axios.post(url, data, {
      headers: headers
    });
    //console.log(result.data);
    return result.data;
  }

  async writeLog(url, apiName, headers, method, input, result) {
    let log = new SendDataLog();
    log.apiUrl = apiName;
    log.keyword = "MC - apiName";
    log.data = JSON.stringify({
      apiname: apiName,
      endpoint: url,
      header: headers,
      method: method,
      input: input
    });
    log.result = JSON.stringify(result);
    log.createdAt = new Date();
    await this.connection.getCustomRepository(SendDataLogRepository).save(log);
  }

  async checkCIC(citizenId, customerName): Promise<any> {
    var axios = require("axios");
    let token = await this.redisClient.get("token");
    if (token == null) {
      let login = await this.login();
      token = login.token;
    }
    let response;
    let mc_api_config = config.get("mc_api");
    let url =
      mc_api_config.endpoint +
      "mobile-4sales/check-cic/check?citizenID=" +
      citizenId +
      "&customerName=" +
      encodeURI(customerName);
    console.log(url);
    let headers = {
      "Content-Type": "application/json",
      "x-security": mc_api_config.security,
      Authorization: "Bearer " + token
    };
    try {
      let result = await axios.get(url, {
        headers: headers
      });
      response = result.data[0];
    } catch (e) {
      response = e.response.data;
      if (response.returnCode == "401") {
        await this.login();
        return await this.checkCIC(citizenId, customerName);
      }
    } finally {
      // let log = new SendDataLog();
      // log.apiUrl = url;
      // let input = {
      //   citizenId: citizenId,
      //   customerName: customerName
      // };
      // await this.writeLog(
      //   url,
      //   "checkCIC",
      //   headers,
      //   "get",
      //   input,
      //   JSON.stringify(response)
      // );
    }
    return response;
  }

  async checkCitizenId(citizenId, productCode): Promise<any> {
    var axios = require("axios");
    let token = await this.redisClient.get("token");
    if (token == null) {
      let login = await this.login();
      token = login.token;
    }
    let response;
    let mc_api_config = config.get("mc_api");
    let url =
      mc_api_config.endpoint +
      "mobile-4sales/check-identifier?citizenId=" +
      citizenId +
      "&productCode=" +
      productCode;
    let headers = {
      "Content-Type": "application/json",
      "x-security": mc_api_config.security,
      Authorization: "Bearer " + token
    };
    try {
      let result = await axios.get(url, {
        headers: headers
      });
      response = result.data;
    } catch (e) {
      response = e.response.data;
      if (response.returnCode == "401") {
        await this.login();
        return await this.checkCitizenId(citizenId, productCode);
      }
    } finally {
      // let log = new SendDataLog();
      // log.apiUrl = url;
      // let input = {
      //   citizenId: citizenId
      // };
      // await this.writeLog(
      //   url,
      //   "checkCitizenId",
      //   headers,
      //   "get",
      //   input,
      //   JSON.stringify(response)
      // );
    }
    return response;
  }

  async checkCategory(companyTaxNumber): Promise<any> {
    var axios = require("axios");
    let token = await this.redisClient.get("token");
    if (token == null) {
      let login = await this.login();
      token = login.token;
    }
    let response;
    let mc_api_config = config.get("mc_api");
    let url =
      mc_api_config.endpoint +
      "/mobile-4sales/check-cat?companyTaxNumber=" +
      companyTaxNumber;
    let headers = {
      "Content-Type": "application/json",
      "x-security": mc_api_config.security,
      Authorization: "Bearer " + token
    };
    try {
      let result = await axios.get(url, {
        headers: headers
      });
      response = result.data;
    } catch (e) {
      response = e.response.data;
      if (response.returnCode == "401") {
        await this.login();
        await this.checkCategory(companyTaxNumber);
      }
    } finally {
      // let log = new SendDataLog();
      // log.apiUrl = url;
      // let input = {
      //   companyTaxNumber: companyTaxNumber
      // };
      // await this.writeLog(
      //   url,
      //   "checkCategory",
      //   headers,
      //   "get",
      //   input,
      //   JSON.stringify(response)
      // );
    }
    return response;
  }

  async getKios(): Promise<any> {
    let mckios = await this.redisClient.get("mckios");
    let response;
    if (mckios == null) {
      var axios = require("axios");
      let token = await this.redisClient.get("token");
      if (token == null) {
        let login = await this.login();
        token = login.token;
      }
      let mc_api_config = config.get("mc_api");
      let url = mc_api_config.endpoint + "mobile-4sales/kiosks";
      let headers = {
        "Content-Type": "application/json",
        "x-security": mc_api_config.security,
        Authorization: "Bearer " + token
      };
      try {
        let result = await axios.get(url, {
          headers: headers
        });
        response = result.data;
      } catch (e) {
        response = e.response.data;
        if (response.returnCode == "401") {
          await this.login();
          return await this.getKios();
        }
      } finally {
        // let log = new SendDataLog();
        // log.apiUrl = url;
        // let input = {};
        // await this.writeLog(
        //     url,
        //     "getKios",
        //     headers,
        //     "get",
        //     input,
        //     JSON.stringify(response)
        // );
      }
    } else {
      response = JSON.parse(mckios);
    }

    return response;
  }

  async getProducts(): Promise<any> {
    let mcproducts = await this.redisClient.get("mcproducts");
    let response;
    if (mcproducts == null) {
      var axios = require("axios");
      let token = await this.redisClient.get("token");
      if (token == null) {
        let login = await this.login();
        token = login.token;
      }

      let mc_api_config = config.get("mc_api");
      let url = mc_api_config.endpoint + "mobile-4sales/products";
      let headers = {
        "Content-Type": "application/json",
        "x-security": mc_api_config.security,
        Authorization: "Bearer " + token
      };
      try {
        let result = await axios.get(url, {
          headers: headers
        });
        response = result.data;
        await this.redisClient.set("mcproducts", JSON.stringify(response));
      } catch (e) {
        response = e.response.data;
        if (response.returnCode == "401") {
          await this.login();
          return await this.getProducts();
        }
      } finally {
        // let log = new SendDataLog();
        // log.apiUrl = url;
        // let input = {};
        // await this.writeLog(
        //     url,
        //     "getProducts",
        //     headers,
        //     "get",
        //     input,
        //     JSON.stringify(response)
        // );
      }
    } else {
      response = JSON.parse(mcproducts);
    }
    return response;
  }

  async downloadPDF(fileid): Promise<any> {
    let response;
    var axios = require("axios");
    let token = await this.redisClient.get("token");
    if (token == null) {
      let login = await this.login();
      token = login.token;
    }

    let mc_api_config = config.get("mc_api");
    let url = mc_api_config.endpoint + "mobile-4sales/downloadPdf/" + fileid;
    let headers = {
      "Content-Type": "application/json",
      "x-security": mc_api_config.security,
      Authorization: "Bearer " + token
    };
    try {
      let result = await axios.get(url, {
        headers: headers,
        responseType: "stream"
      });
      response = result;
    } catch (e) {
      response = e.response.data;
      if (response.returnCode == "401") {
        await this.login();
        return await this.downloadPDF(fileid);
      }
    }
    return response;
  }

  async checkList(dto: McCheckListrequestDto): Promise<any> {
    var axios = require("axios");
    let token = await this.redisClient.get("token");
    if (token == null) {
      let login = await this.login();
      token = login.token;
    }
    let response;
    let mc_api_config = config.get("mc_api");
    let url =
      mc_api_config.endpoint +
      "mobile-4sales/check-list?" +
      "mobileSchemaProductCode=" +
      dto.mobileSchemaProductCode +
      "&mobileTemResidence=" +
      dto.mobileTemResidence +
      "&shopCode=" +
      dto.shopCode +
      "&loanAmountAfterInsurrance=" +
      dto.loanAmountAfterInsurrance +
      "&hasCourier=" +
      dto.hasCourier;
    let headers = {
      "Content-Type": "application/json",
      "x-security": mc_api_config.security,
      Authorization: "Bearer " + token
    };
    try {
      let result = await axios.get(url, {
        headers: headers
      });
      response = result.data;
      for (const i in response.checkList) {
        if (response.checkList[i].groupId == 34) {
          response.checkList[i].mandatory = 1;
        }
      }
    } catch (e) {
      response = e.response.data;
      if (response.returnCode == "401") {
        await this.login();
        return await this.checkList(dto);
      }
    } finally {
      // let log = new SendDataLog();
      // log.apiUrl = url;
      // let data = JSON.stringify({
      //   header: headers,
      //   method: "get",
      //   input: {
      //     dto
      //   }
      // });
      // await this.writeLog(
      //     url,
      //     "checkList",
      //     headers,
      //     "get",
      //     data,
      //     JSON.stringify(response)
      // );
    }
    return response;
  }

  async checkInitContract(dto: CheckInitContractRequestDto): Promise<any> {
    var axios = require("axios");
    let token = await this.redisClient.get("token");
    if (token == null) {
      let login = await this.login();
      token = login.token;
    }
    let response;
    let mc_api_config = config.get("mc_api");
    let url = mc_api_config.endpoint + "mobile-4sales/check-init-contract";
    var data = JSON.stringify({
      productId: dto.productId,
      customerName: dto.customerName,
      citizenId: dto.citizenId,
      loanAmount: dto.loanAmount,
      loanTenor: dto.loanTenor,
      customerIncome: dto.customerIncome,
      dateOfBirth: dto.dateOfBirth,
      gender: dto.gender,
      issuePlace: dto.issuePlace,
      hasInsurance: dto.hasInsurance
    });
    console.log(data);
    let headers = {
      "Content-Type": "application/json",
      "x-security": mc_api_config.security,
      Authorization: "Bearer " + token
    };
    console.log(headers);
    try {
      let result = await axios.post(url, data, {
        headers: headers
      });
      response = result.data;
    } catch (e) {
      response = e.response.data;
      console.log("Errors");
      if (response.returnCode == "401") {
        await this.login();
        return await this.checkInitContract(dto);
      }
    } finally {
      let log = new SendDataLog();
      log.apiUrl = url;
      let data = JSON.stringify({
        header: headers,
        method: "post",
        input: {
          dto
        }
      });
      await this.writeLog(
        url,
        "checkInitContract",
        headers,
        "post",
        data,
        response
      );
    }
    return response;
  }

  async createUploadFile(dtoAttachFiles: McAttachfilesResponseDto) {
    var fs = require("fs");
    let dirname = Date.now();
    let fileZipName = `${dirname}.zip`;
    let filePath = `${__dirname}/../../attach_files/`;
    var dir = filePath + dirname;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    var info = [];
    let i = 1;
    for (const attachFile of dtoAttachFiles.rows) {
      if (attachFile.url != "") {
        let ext: any = attachFile.url.split(".");
        ext = ext[ext.length - 1].toLowerCase();
        let fileName = `${i}.${ext}`;
        let filePath = `${dir}/${fileName}`;
        var requestUtil = new RequestUtil(this.httpService);
        console.log(attachFile);
        console.log("download file " + fileName);
        await requestUtil.downloadPublicFile(attachFile.url, filePath);
        let item = {
          fileName: fileName,
          documentCode: attachFile.documentCode,
          mimeType: ext,
          groupId: attachFile.groupId
        };
        info.push(item);
      }
      i++;
    }
    var zipper = require("zip-local");
    zipper.sync
      .zip(dir)
      .compress()
      .save(`${filePath}/${fileZipName}`);
    const md5File = require("md5-file");
    const md5checksum = md5File.sync(`${filePath}/${fileZipName}`);
    console.log(`The MD5 sum of LICENSE.md is: ${md5checksum}`);

    return {
      info: info,
      md5checksum: md5checksum,
      filePath: `${filePath}/${fileZipName}`
    };
  }

  async uploadDocument(
    dtoMcLoanProfileRepository: LoanProfileResponseDto,
    dtoAttachFiles: McAttachfilesResponseDto,
    appStatus: number
  ): Promise<any> {
    console.log("Call API");
    let token = await this.redisClient.get("token");
    if (token == null) {
      let login = await this.login();
      token = login.token;
    }
    let response;
    let mc_api_config = config.get("mc_api");
    console.log("Begin createUploadFile");
    var result = await this.createUploadFile(dtoAttachFiles);
    console.log(result);
    console.log("END createUploadFile");
    let saleCode = mc_api_config.saleCode;
    let security = mc_api_config.security;
    if (dtoMcLoanProfileRepository.hasCourier) {
      saleCode = mc_api_config.saleCodeDSA;
    }
    var axios = require("axios");
    var FormData = require("form-data");
    var fs = require("fs");
    var data = new FormData();
    var obj = {
      request: {
        id: dtoMcLoanProfileRepository.profileid,
        saleCode: saleCode,
        customerName: dtoMcLoanProfileRepository.customerName,
        productId: dtoMcLoanProfileRepository.productId,
        citizenId: dtoMcLoanProfileRepository.citizenId,
        tempResidence: dtoMcLoanProfileRepository.tempResidence,
        loanAmount: dtoMcLoanProfileRepository.loanAmount,
        loanTenor: dtoMcLoanProfileRepository.loanTenor,
        hasInsurance: dtoMcLoanProfileRepository.hasInsurance,
        issuePlace: dtoMcLoanProfileRepository.issuePlace,
        shopCode: dtoMcLoanProfileRepository.shopCode,
        companyTaxNumber: dtoMcLoanProfileRepository.companyTaxNumber,
        hasCourier: dtoMcLoanProfileRepository.hasCourier
      },
      mobileProductType: dtoMcLoanProfileRepository.mobileProductType,
      mobileIssueDateCitizen: dtoMcLoanProfileRepository.mobileIssueDateCitizen,
      appStatus: appStatus,
      md5: result.md5checksum,
      info: result.info
    };
    console.log(obj);
    data.append("file", fs.createReadStream(result.filePath));
    data.append("object", JSON.stringify(obj));
    console.log(data);
    response = obj;
    var configdata = {
      method: "post",
      url: mc_api_config.endpoint + "mobile-4sales/upload-document",
      headers: {
        "Content-Type": "multipart/form-data",
        "x-security": security,
        Authorization: "Bearer " + token,
        ...data.getHeaders()
      }
    };

    try {
      let result = await axios.post(configdata.url, data, {
        headers: configdata.headers,
        maxContentLength: 100000000,
        maxBodyLength: 1000000000
      });
      //fs.unlinkSync(result.filePath);

      response = result.data;
      response.returnCode = "200";
    } catch (e) {
      console.log("ERROR");
      console.log(e);
      //fs.unlinkSync(result.filePath);
      if (e.response.data != undefined) {
        if (e.response.data.returnCode == "401") {
          await this.login();
          return await this.uploadDocument(
            dtoMcLoanProfileRepository,
            dtoAttachFiles,
            appStatus
          );
        }
        response = e.response.data;
      } else {
        response = e.response;
      }
    } finally {
      let log = new SendDataLog();
      log.apiUrl = configdata.url;
      await this.writeLog(
        configdata.url,
        "uploadDocument - " + appStatus,
        configdata.headers,
        "post",
        obj,
        response
      );
    }
    return response;
  }

  async getCases(dto: GetMcCaseRequestDto): Promise<any> {
    var axios = require("axios");
    let token = await this.redisClient.get("token");
    if (token == null) {
      let login = await this.login();
      token = login.token;
    }
    console.log("Token: " + token);
    let response;
    let mc_api_config = config.get("mc_api");
    let saleCode = dto.hasCourier
      ? mc_api_config.saleCodeDSA
      : mc_api_config.saleCode;
    console.log(saleCode);
    let url =
      mc_api_config.endpoint +
      "mobile-4sales/cases?" +
      "pageNumber=" +
      dto.pageNumber +
      "&pageSize=" +
      dto.pageSize +
      "&keyword=" +
      dto.keyword +
      "&status=" +
      dto.status +
      "&saleCode=" +
      saleCode;
    //console.log(url);
    let headers = {
      "Content-Type": "application/json",
      "x-security": mc_api_config.security,
      Authorization: "Bearer " + token
    };

    try {
      let result = await axios.get(url, {
        headers: headers
      });
      //console.log("true");
      //console.log(result);
      response = result.data;
    } catch (e) {
      //console.log("false");
      response = e.response.data;
      //console.log(response);
      if (response.returnCode == "401") {
        await this.login();
        return await this.getCases(dto);
      }
    } finally {
      let input = {};
      await this.writeLog(
        url,
        "getCases -" + dto.status,
        headers,
        "get",
        input,
        ""
      );
    }
    return response;
  }

  async listCaseNote(appNumber): Promise<any> {
    var axios = require("axios");
    let token = await this.redisClient.get("token");
    if (token == null) {
      let login = await this.login();
      token = login.token;
    }
    let response;
    let mc_api_config = config.get("mc_api");
    let url =
      mc_api_config.endpoint + "/mobile-4sales/list-case-note/" + appNumber;
    let headers = {
      "Content-Type": "application/json",
      "x-security": mc_api_config.security,
      Authorization: "Bearer " + token
    };
    try {
      let result = await axios.get(url, {
        headers: headers
      });
      response = result.data;
    } catch (e) {
      response = e.response.data;
      if (response.returnCode == "401") {
        await this.login();
        await this.listCaseNote(appNumber);
      }
    }
    return response;
  }

  async sendCaseNote(appNumber, noteContent): Promise<any> {
    var axios = require("axios");
    let token = await this.redisClient.get("token");
    if (token == null) {
      let login = await this.login();
      token = login.token;
    }
    let response;
    let mc_api_config = config.get("mc_api");
    let url = mc_api_config.endpoint + "/mobile-4sales/send-case-note";
    let headers = {
      "Content-Type": "application/json",
      "x-security": mc_api_config.security,
      Authorization: "Bearer " + token
    };
    try {
      let result = await axios.post(
        url,
        {
          appNumber: appNumber,
          noteContent: noteContent
        },
        {
          headers: headers
        }
      );
      response = result.data;
    } catch (e) {
      response = e.response.data;
      if (response.returnCode == "401") {
        await this.login();
        await this.sendCaseNote(appNumber, noteContent);
      }
    }
    return response;
  }

  async cancelCase(
    profileid: number,
    reason: number,
    comment: string
  ): Promise<any> {
    var axios = require("axios");
    let token = await this.redisClient.get("token");
    if (token == null) {
      let login = await this.login();
      token = login.token;
    }
    console.log(profileid);
    let response;
    let mc_api_config = config.get("mc_api");
    let url = mc_api_config.endpoint + "/mobile-4sales/cancel-case";
    let headers = {
      "Content-Type": "application/json",
      "x-security": mc_api_config.security,
      Authorization: "Bearer " + token
    };
    try {
      let result = await axios.post(
        url,
        {
          id: profileid,
          reason: reason,
          comment: comment
        },
        {
          headers: headers
        }
      );
      response = result.data;
    } catch (e) {
      console.log("ERORR");
      response = e.response.data;
      if (response.returnCode == "401") {
        await this.login();
        return await this.cancelCase(profileid, reason, comment);
      }
    }
    return response;
  }

  async getReturnChecklist(appId): Promise<any> {
    var axios = require("axios");
    let token = await this.redisClient.get("token");
    if (token == null) {
      let login = await this.login();
      token = login.token;
    }
    let response;
    let mc_api_config = config.get("mc_api");
    let url =
      mc_api_config.endpoint +
      "/mobile-4sales/third-party/checklist?appId=" +
      appId;
    let headers = {
      "Content-Type": "application/json",
      "x-security": mc_api_config.security,
      Authorization: "Bearer " + token
    };
    try {
      let result = await axios.get(url, {
        headers: headers
      });
      response = result.data;
    } catch (e) {
      response = e.response.data;
      if (response.returnCode == "401") {
        await this.login();
        await this.getReturnChecklist(appId);
      }
    }
    return response;
  }

  async requestSendOtp3P(phone, typeScore): Promise<any> {
    var axios = require("axios");
    let token = await this.redisClient.get("token");
    if (token == null) {
      let login = await this.login();
      token = login.token;
    }
    let response;
    let mc_api_config = config.get("mc_api");
    let url = mc_api_config.endpoint + "/mobile-4sales/requestOTP3P";
    let headers = {
      "Content-Type": "application/json",
      "x-security": mc_api_config.security,
      Authorization: "Bearer " + token
    };
    try {
      let result = await axios.post(
        url,
        {
          requested_msisdn: phone,
          typeScore: typeScore
        },
        {
          headers: headers
        }
      );
      response = result.data;
      response.returnCode = 200;
    } catch (e) {
      response = e.response.data;
      if (response.returnCode == "401") {
        await this.login();
        await this.requestSendOtp3P(phone, typeScore);
      }
    } finally {
      // let input = {
      //   requested_msisdn: phone,
      //   typeScore: typeScore
      // };
      // await this.writeLog(
      //   url,
      //   "requestSendOtp3P",
      //   headers,
      //   "post",
      //   input,
      //   response
      // );
    }
    return response;
  }

  async requestScoring3P(dto: requestScoring3PDto): Promise<any> {
    var axios = require("axios");
    let token = await this.redisClient.get("token");
    if (token == null) {
      let login = await this.login();
      token = login.token;
    }
    let response;
    let mc_api_config = config.get("mc_api");
    let url = mc_api_config.endpoint + "/mobile-4sales/scoring3P";
    let headers = {
      "Content-Type": "application/json",
      "x-security": mc_api_config.security,
      Authorization: "Bearer " + token
    };
    try {
      let result = await axios.post(
        url,
        {
          verificationCode: dto.verificationCode,
          primaryPhone: dto.primaryPhone,
          nationalId: dto.nationalId,
          typeScore: dto.typeScore,
          userName: mc_api_config.username
        },
        {
          headers: headers
        }
      );
      response = result.data;
      response.returnCode = 200;
    } catch (e) {
      response = e.response.data;
      if (response.returnCode == "401") {
        await this.login();
        await this.requestScoring3P(dto);
      }
    } finally {
      // let input = {
      //   verificationCode: dto.verificationCode,
      //   primaryPhone: dto.primaryPhone,
      //   nationalId: dto.nationalId,
      //   typeScore: dto.typeScore,
      //   userName: mc_api_config.username
      // };
      // await this.writeLog(
      //   url,
      //   "requestScoring3P",
      //   headers,
      //   "post",
      //   input,
      //   response
      // );
    }
    return response;
  }
}
