import {Injectable} from "@nestjs/common";
import * as config from "config";
import {CheckInitContractRequestDto} from "../../modules/mc/mc-loan-profile/dto/check-init-contract.request.dto";
import {RedisClient} from "../shared";

@Injectable()
export class McapiUtil {
    constructor(protected readonly redisClient: RedisClient) {

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
        await this.redisClient.set('token', result.data.token);
        return result.data;
    }

    async checkCIC(citizenId, customerName): Promise<any> {
        var axios = require("axios");
        let token = await this.redisClient.get('token');
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
            if (response.returnCode == '401') {
                await this.login();
                return await this.checkCIC(citizenId, customerName);
            }
        }
        return response;
    }

    async checkCitizenId(citizenId): Promise<any> {
        var axios = require("axios");
        let token = await this.redisClient.get('token');
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
            if (response.returnCode == '401') {
                await this.login();
                return await this.checkCitizenId(citizenId);
            }
        }
        return response;
    }

    async checkCategory(companyTaxNumber): Promise<any> {
        var axios = require("axios");
        let token = await this.redisClient.get('token');
        if (token == null) {
            let login = await this.login();
            token = login.token;
        }
        let response;
        let mc_api_config = config.get("mc_api");
        let url =
            mc_api_config.endpoint +
            "/mobile-4sales/check-cat?companyTaxNumber=" + companyTaxNumber;
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
            if (response.returnCode == '401') {
                await this.login();
                await this.checkCategory(companyTaxNumber);
            }
        }
        return response;
    }

    async getKios(): Promise<any> {
        var axios = require("axios");
        let token = await this.redisClient.get('token');
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
            if (response.returnCode == '401') {
                await this.login();
                return await this.getKios();
            }
        }
        return response;
    }

    async getProducts(): Promise<any> {
        var axios = require("axios");
        let token = await this.redisClient.get('token');
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
            if (response.returnCode == '401') {
                await this.login();
                return await this.getProducts();
            }
        }
        return response;
    }

    async checkList(productCode, mobileTemResidence, loanAmount, shopCode): Promise<any> {
        var axios = require("axios");
        let token = await this.redisClient.get('token');
        if (token == null) {
            let login = await this.login();
            token = login.token;
        }
        let response;
        let mc_api_config = config.get("mc_api");
        let url = mc_api_config.endpoint + "mobile-4sales/check-list?" +
            "mobileSchemaProductCode=" + productCode +
            "&mobileTemResidence=" + mobileTemResidence +
            "&shopCode=" + shopCode +
            "&loanAmountAfterInsurrance=" + loanAmount;
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
            if (response.returnCode == '401') {
                await this.login();
                await this.checkList(productCode, mobileTemResidence, loanAmount, shopCode);
            }
        }
        return response;
    }

    async checkInitContract(dto: CheckInitContractRequestDto): Promise<any> {
        var axios = require("axios");
        let token = await this.redisClient.get('token');
        if (token == null) {
            let login = await this.login();
            token = login.token;
        }
        let response;
        let mc_api_config = config.get("mc_api");
        let url = mc_api_config.endpoint + "mobile-4sales/check-init-contract";
        var data = JSON.stringify({
            "productId": dto.productId,
            "customerName": dto.customerName,
            "citizenId": dto.citizenId,
            "loanAmount": dto.loanAmount,
            "loanTenor": dto.loanTenor,
            "customerIncome": dto.customerIncome,
            "dateOfBirth": dto.dateOfBirth,
            "gender": dto.gender,
            "issuePlace": dto.issuePlace,
            "hasInsurance": dto.hasInsurance
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
            if (response.returnCode == '401') {
                await this.login();
                await this.checkInitContract(dto);
            }
        }
        return response;
    }

    async uploadDocument(): Promise<any> {
        let login = await this.login();
        let token = login.token;
        console.log(token);
        var axios = require('axios');
        var FormData = require('form-data');
        var fs = require('fs');
        var data = new FormData();
        data.append('file', fs.createReadStream('/C:/Users/ho.lu/OneDrive/FinViet/MCredit/upload/upload1.zip'));
        data.append('object', '{\n    "request": {\n        "id": "",\n        "saleCode": "RD014100001",\n        "customerName": "Lư Thiết Hồ",\n        "productId": 3214,\n        "citizenId": "079082013285",\n        "tempResidence": 1,\n        "loanAmount": 20000000,\n        "loanTenor": 12,\n        "hasInsurance": 1,\n        "issuePlace": "54 Nguyễn Chí Thanh,Láng Thượng, Đống Đa, Hà Nội",\n        "shopCode": "KIK280001",\n        "companyTaxNumber": 432432343242,\n        "hasCourier": "0"\n    },\n    "mobileProductType": "Cash Loan",\n    "mobileIssueDateCitizen": "15/12/2008",\n    "appStatus": 1,\n    "md5": "db8d77f46bb8e309fff7bb17e0cc5dd4",\n    "info": [\n        {\n            "fileName": "1.jpg",\n            "documentCode": "CivicIdentity",\n            "mimeType": "jpg",\n            "groupId": 22\n        },\n        {\n            "fileName": "2.jpg",\n            "documentCode": "DOC_salarySuspension",\n            "mimeType": "jpg",\n            "groupId": 139\n        },\n        {\n            "fileName": "3.jpg",\n            "documentCode": "FamilyBook",\n            "mimeType": "jpg",\n            "groupId": 19\n        },\n        {\n            "fileName": "4.jpg",\n            "documentCode": "FacePhoto",\n            "mimeType": "jpg",\n            "groupId": 26\n        },\n        {\n            "fileName": "5.jpg",\n            "documentCode": "TemporaryResidenceConfirmation",\n            "mimeType": "jpg",\n            "groupId": 23\n        },\n        {\n            "fileName": "6.jpg",\n            "documentCode": "HomeOwnershipCertification",\n            "mimeType": "jpg",\n            "groupId": 25\n        },\n        {\n            "fileName": "7.jpg",\n            "documentCode": "InternetBill",\n            "mimeType": "jpg",\n            "groupId": 24\n        },\n        {\n            "fileName": "8.jpg",\n            "documentCode": "StatementPaymentAccount",\n            "mimeType": "jpg",\n            "groupId": 30\n        },\n        {\n            "fileName": "9.jpg",\n            "documentCode": "CustomerInformationSheet",\n            "mimeType": "jpg",\n            "groupId": 34\n        },\n        {\n            "fileName": "10.jpg",\n            "documentCode": "BirthCertificate",\n            "mimeType": "jpg",\n            "groupId": 37\n        }\n    ]\n}');

        var config = {
            method: 'post',
            url: 'https://uat-mfs-v2.mcredit.com.vn:8043/mcMobileService/service/v1.0/mobile-4sales/upload-document',
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-security': 'FINVIET-7114da26-2e6a-497c-904f-4372308ecb2d',
                'Authorization': 'Bearer '+token,
                ...data.getHeaders()
            },
            data : data
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });


    }
}
