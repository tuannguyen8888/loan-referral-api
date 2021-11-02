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
        console.log('Call API')
        let login = await this.login();
        let token = login.token;
        var axios = require('axios');
        var FormData = require('form-data');
        var fs = require('fs');
        var data = new FormData();
        //data.append('file', fs.createReadStream('C:/Users/ho.lu/OneDrive/FinViet/MCredit/upload/upload1.zip'));
        var obj = '{' +
            '    "request": {' +
            '        "id": "",' +
            '        "saleCode": "RD014100001",' +
            '        "customerName": "Lư Thiết Hồ",' +
            '        "productId": 3214,' +
            '        "citizenId": "079082013285",' +
            '        "tempResidence": 1,' +
            '        "loanAmount": 20000000,' +
            '        "loanTenor": 12,' +
            '        "hasInsurance": 1,' +
            '        "issuePlace": "54 Nguyễn Chí Thanh,Láng Thượng, Đống Đa, Hà Nội",' +
            '        "shopCode": "KIK280001",' +
            '        "companyTaxNumber": 432432343242,' +
            '        "hasCourier": "0"' +
            '    },' +
            '    "mobileProductType": "Cash Loan",' +
            '    "mobileIssueDateCitizen": "15/12/2008",' +
            '    "appStatus": 1,' +
            '    "md5": "db8d77f46bb8e309fff7bb17e0cc5dd4",' +
            '    "info": [' +
            '        {' +
            '            "fileName": "1.jpg",' +
            '            "documentCode": "CivicIdentity",' +
            '            "mimeType": "jpg",' +
            '            "groupId": 22' +
            '        },' +
            '        {' +
            '            "fileName": "2.jpg",' +
            '            "documentCode": "DOC_salarySuspension",' +
            '            "mimeType": "jpg",' +
            '            "groupId": 139' +
            '        },' +
            '        {' +
            '            "fileName": "3.jpg",' +
            '            "documentCode": "FamilyBook",' +
            '            "mimeType": "jpg",' +
            '            "groupId": 19' +
            '        },' +
            '        {' +
            '            "fileName": "4.jpg",' +
            '            "documentCode": "FacePhoto",' +
            '            "mimeType": "jpg",' +
            '            "groupId": 26' +
            '        },' +
            '        {' +
            '            "fileName": "5.jpg",' +
            '            "documentCode": "TemporaryResidenceConfirmation",' +
            '            "mimeType": "jpg",' +
            '            "groupId": 23' +
            '        },' +
            '        {' +
            '            "fileName": "6.jpg",' +
            '            "documentCode": "HomeOwnershipCertification",' +
            '            "mimeType": "jpg",' +
            '            "groupId": 25' +
            '        },' +
            '        {' +
            '            "fileName": "7.jpg",' +
            '            "documentCode": "InternetBill",' +
            '            "mimeType": "jpg",' +
            '            "groupId": 24' +
            '        },' +
            '        {' +
            '            "fileName": "8.jpg",' +
            '            "documentCode": "StatementPaymentAccount",' +
            '            "mimeType": "jpg",' +
            '            "groupId": 30' +
            '        },' +
            '        {' +
            '            "fileName": "9.jpg",' +
            '            "documentCode": "CustomerInformationSheet",' +
            '            "mimeType": "jpg",' +
            '            "groupId": 34' +
            '        },' +
            '        {' +
            '            "fileName": "10.jpg",' +
            '            "documentCode": "BirthCertificate",' +
            '            "mimeType": "jpg",' +
            '            "groupId": 37' +
            '        }' +
            '    ]' +
            '}'
        data.append('file', '');
        data.append('object', JSON.stringify(obj));
        //console.log(data);
        var config = {
            method: 'post',
            url: 'https://uat-mfs-v2.mcredit.com.vn:8043/mcMobileService/service/v1.0/mobile-4sales/upload-document',
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-security': 'FINVIET-7114da26-2e6a-497c-904f-4372308ecb2d',
                'Authorization': 'Bearer ' + token,
                ...data.getHeaders()
            },
            data : data
        };
        let url = "https://uat-mfs-v2.mcredit.com.vn:8043/mcMobileService/service/v1.0/mobile-4sales/upload-document";
        try {
            let result = await axios.post(url, data, {
                headers: config.headers
            });

            return result.data;
        }catch (e) {
            console.log('ERROR');
            console.log(e.response.data);
            return e.response.data;
        }


    }
}
