import {Injectable} from "@nestjs/common";
import * as config from "config";
import {CheckInitContractRequestDto} from "../../modules/mc/mc-loan-profile/dto/check-init-contract.request.dto";

@Injectable()
export class McapiUtil {
    constructor() {
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
        return result.data;
    }

    async checkCIC(citizenId, customerName): Promise<any> {
        var axios = require("axios");
        let login = await this.login();
        let token = login.token;
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
        }
        return response;
    }

    async checkCitizenId(citizenId): Promise<any> {
        var axios = require("axios");
        let login = await this.login();
        let token = login.token;
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
        }
        return response;
    }

    async getKios(): Promise<any> {
        var axios = require("axios");
        let login = await this.login();
        let token = login.token;
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
        }
        return response;
    }

    async getProducts(): Promise<any> {
        var axios = require("axios");
        let login = await this.login();
        let token = login.token;
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
        }
        return response;
    }
    async checkInitContract(dto: CheckInitContractRequestDto): Promise<any> {
        var axios = require("axios");
        let login = await this.login();
        let token = login.token;
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
            let result = await axios.post(url, data,{
                headers:headers
            });
            response = result.data;
        } catch (e) {
            response = e.response.data;
        }
        return response;
    }
}
