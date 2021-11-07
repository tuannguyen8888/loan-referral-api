import {HttpService, Inject, Injectable} from "@nestjs/common";
import * as config from "config";
import {CheckInitContractRequestDto} from "../../modules/mc/mc-loan-profile/dto/check-init-contract.request.dto";
import {RedisClient} from "../shared";
import fs from "fs";
import {RequestUtil} from "./request.util";
import {McLoanProfile} from "../../entities";
import {McLoanProfileDto} from "../../modules/mc/mc-loan-profile/dto";
import {McAttachfilesResponseDto} from "../../modules/mc/mc-attachfile/dto/mc-attachfiles.response.dto";
import {GetMcCaseRequestDto} from "../../modules/mc/mc-loan-profile/dto/get-mc-case.request.dto";

@Injectable()
export class McapiUtil {
  constructor(
      protected readonly redisClient: RedisClient,
      @Inject(HttpService) private readonly httpService: HttpService
  ) {
  }

  async login(): Promise<any> {
    let mc_api_config = config.get("mc_api");
    var axios = require("axios");
    var data = JSON.stringify({
      username: "finviet.3rd",
      password: "123456a@",
      notificationId: "notificationId.finviet.3rd",
      imei: "imei.finviet.3rd",
      osType: "IOS"
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
        customerName;
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
    }
    return response;
  }

  async checkCitizenId(citizenId): Promise<any> {
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
        citizenId;
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
        return await this.checkCitizenId(citizenId);
      }
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
    }
    return response;
  }

  async getKios(): Promise<any> {
    var axios = require("axios");
    let token = await this.redisClient.get("token");
    if (token == null) {
      let login = await this.login();
      token = login.token;
    }
    let response;
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
    }
    return response;
  }

  async getProducts(): Promise<any> {
    var axios = require("axios");
    let token = await this.redisClient.get("token");
    if (token == null) {
      let login = await this.login();
      token = login.token;
    }
    let response;
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
    } catch (e) {
      response = e.response.data;
      if (response.returnCode == "401") {
        await this.login();
        return await this.getProducts();
      }
    }
    return response;
  }

  async checkList(
      productCode,
      mobileTemResidence,
      loanAmount,
      shopCode
  ): Promise<any> {
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
        productCode +
        "&mobileTemResidence=" +
        mobileTemResidence +
        "&shopCode=" +
        shopCode +
        "&loanAmountAfterInsurrance=" +
        loanAmount;
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
        await this.checkList(
            productCode,
            mobileTemResidence,
            loanAmount,
            shopCode
        );
      }
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
      console.log('Errors');
      if (response.returnCode == "401") {
        await this.login();
        return await this.checkInitContract(dto);
      }
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
      console.log(attachFile);
      console.log(attachFile.url);
      let ext: any = attachFile.url.split(".");
      ext = ext[ext.length - 1].toLowerCase();
      let fileName = `${i}.${ext}`;
      let filePath = `${dir}/${fileName}`;
      var requestUtil = new RequestUtil(this.httpService);
      await requestUtil.downloadPublicFile(attachFile.url, filePath);
      let item = {
        fileName: fileName,
        documentCode: attachFile.documentCode,
        mimeType: ext,
        groupId: attachFile.groupId
      };
      info.push(item);
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
      dtoMcLoanProfile: McLoanProfileDto,
      dtoAttachFiles: McAttachfilesResponseDto
  ): Promise<any> {
    console.log("Call API");
    let token = await this.redisClient.get("token");
    if (token == null) {
      let login = await this.login();
      token = login.token;
    }
    let mc_api_config = config.get("mc_api");
    var result = await this.createUploadFile(dtoAttachFiles);
    var axios = require("axios");
    var FormData = require("form-data");
    var fs = require("fs");
    var data = new FormData();
    var obj = {
      request: {
        id: "",
        saleCode: mc_api_config.saleCode,
        customerName: dtoMcLoanProfile.customerName,
        productId: dtoMcLoanProfile.productId,
        citizenId: dtoMcLoanProfile.citizenId,
        tempResidence: dtoMcLoanProfile.tempResidence,
        loanAmount: dtoMcLoanProfile.loanAmount,
        loanTenor: dtoMcLoanProfile.loanTenor,
        hasInsurance: dtoMcLoanProfile.hasInsurance,
        issuePlace: dtoMcLoanProfile.issuePlace,
        shopCode: dtoMcLoanProfile.shopCode,
        companyTaxNumber: dtoMcLoanProfile.companyTaxNumber,
        hasCourier: dtoMcLoanProfile.hasCourier
      },
      mobileProductType: dtoMcLoanProfile.mobileProductType,
      mobileIssueDateCitizen: dtoMcLoanProfile.mobileIssueDateCitizen,
      appStatus: 1,
      md5: result.md5checksum,
      info: result.info
    };
    console.log(obj);
    data.append("file", fs.createReadStream(result.filePath));
    data.append("object", JSON.stringify(obj));
    var configdata = {
      method: "post",
      url:
          "https://uat-mfs-v2.mcredit.com.vn:8043/mcMobileService/service/v1.0/mobile-4sales/upload-document",
      headers: {
        "Content-Type": "multipart/form-data",
        "x-security": "FINVIET-7114da26-2e6a-497c-904f-4372308ecb2d",
        Authorization: "Bearer " + token,
        ...data.getHeaders()
      }
    };

    try {
      let result = await axios.post(configdata.url, data, {
        headers: configdata.headers
      });
      //fs.unlinkSync(result.filePath);
      return result.data;
    } catch (e) {
      console.log("ERROR");
      //fs.unlinkSync(result.filePath);
      if (e.response.data.returnCode == "401") {
        await this.login();
        return await this.uploadDocument(dtoMcLoanProfile, dtoAttachFiles);
      }
      return e.response.data;
    }
  }

  async getCases(dto: GetMcCaseRequestDto): Promise<any> {
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
        mc_api_config.saleCode;
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
        return await this.getCases(dto);
      }
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
        mc_api_config.endpoint +
        "/mobile-4sales/list-case-note/" + appNumber;
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
    let url =
        mc_api_config.endpoint +
        "/mobile-4sales/send-case-note";
    let headers = {
      "Content-Type": "application/json",
      "x-security": mc_api_config.security,
      Authorization: "Bearer " + token
    };
    try {
      let result = await axios.post(url, {
        appNumber: appNumber,
        noteContent: noteContent
      }, {
        headers: headers
      });
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

  async cancelCase(profileid, reason, comment): Promise<any> {
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
        "/mobile-4sales/cancel-case";
    let headers = {
      "Content-Type": "application/json",
      "x-security": mc_api_config.security,
      Authorization: "Bearer " + token
    };
    try {
      let result = await axios.post(url, {
        id: profileid,
        reason: reason,
        comment: comment,
      }, {
        headers: headers
      });
      response = result.data;
    } catch (e) {
      response = e.response.data;
      if (response.returnCode == "401") {
        await this.login();
        await this.cancelCase(profileid, reason, comment);
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
        "/mobile-4sales/third-party/checklist?appId=" + appId;
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
}
