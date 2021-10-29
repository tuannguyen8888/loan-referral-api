import { Injectable } from "@nestjs/common";

@Injectable()
export class McapiUtil {
  constructor() {}

  async login(): Promise<any> {
    var axios = require("axios");
    var data = JSON.stringify({
      username: "finviet.3rd",
      password: "123456a@",
      notificationId: "notificationId.finviet.3rd",
      imei: "imei.finviet.3rd",
      osType: "IOS"
    });

    var config = {
      method: "post",
      url:
        "https://uat-mfs-v2.mcredit.com.vn:8043/mcMobileService/service/v1.0/authorization/",
      headers: {
        "Content-Type": "application/json",
        "x-security": "FINVIET-7114da26-2e6a-497c-904f-4372308ecb2d"
      },
      data: data
    };

    let result = await axios.post(config.url, data, {
      headers: config.headers
    });
    //console.log(result.data);
    return result.data;
  }
  async checkCIC(citizenID, customerName): Promise<any> {}
}
