import * as axios from "axios";
import * as FormData from "form-data";
import { HttpService, Inject, Injectable } from "@nestjs/common";
import { DownloadFileResParam } from "../interfaces/response";
import * as fs from "fs";
import * as config from "config";

@Injectable()
export class RequestUtil {
  constructor(
    @Inject(HttpService) private readonly httpService: HttpService // @Inject(FVBackendConfigProvider) private readonly config: FVBackendConfig,
  ) {}

  async post<T>(
    url: string,
    body: unknown,
    config?: axios.AxiosRequestConfig
  ): Promise<any> {
    try {
      if (!config) {
        config = {};
      }
      config.timeout = 60 * 1000;
      // config.timeoutErrorMessage =
      //   "Timeout roi cha noi, api gi ma cham qua vay";
      console.log("call partner api: ", url);
      console.log("body = ", body);
      const { data } = await this.httpService
        .post<T>(url, body, config)
        .toPromise();
      // console.log("api result data = ", data);
      return data;
    } catch (error) {
      console.error(
        "error call " + url + ": " + error.message + " body = ",
        body
      );
      throw error;
    }
  }
  async get<T>(
    url: string,
    body: unknown,
    config?: axios.AxiosRequestConfig
  ): Promise<any> {
    try {
      if (!config) {
        config = {};
      }
      config.timeout = 60 * 1000;
      // config.timeoutErrorMessage =
      //   "Timeout roi cha noi, api gi ma cham qua vay";
      console.log("call partner api: ", url);
      console.log("body = ", body);
      const { data } = await this.httpService.get<T>(url, body).toPromise();
      // console.log("api result data = ", data);
      return data;
    } catch (error) {
      console.error(
        "error call " + url + ": " + error.message + " body = ",
        body
      );
      throw error;
    }
  }
  async uploadFile<T>(
    url: string,
    formData: FormData,
    auth = null,
    headers = null
  ): Promise<T> {
    try {
      let config: any = {
        headers: {
          "Content-Type": "multipart/form-data",
          ...formData.getHeaders()
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      };
      if (auth) {
        config.auth = auth;
      }
      if (headers) {
        config.headers = {
          ...config.headers,
          ...headers
        };
      }
      const { data } = await this.httpService
        .post<T>(url, formData, config)
        .toPromise();
      return data;
    } catch (error) {
      console.error("error call uploadFile " + url + ": " + error.message);
      throw error;
    }
  }

  async downloadFile<T>(
    url: string,
    token: string,
    initiator: string,
    fileName: string,
    config?: axios.AxiosRequestConfig
  ): Promise<DownloadFileResParam> {
    try {
      const downloadUrl = `${url}?token=${token}&initiator=${initiator}&filename=${fileName}`;
      const { data } = await this.httpService
        .get<T>(downloadUrl, config)
        .toPromise();
      return { downloadUrl, data };
    } catch (error) {
      throw error;
    }
  }
  async downloadPublicFile<T>(
    url: string,
    fileName: string
  ): Promise<fs.ReadStream> {
    try {
      const writer = fs.createWriteStream(fileName);

      const response = await this.httpService.axiosRef({
        url: url,
        method: "GET",
        responseType: "stream"
      });

      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on("finish", () => {
          writer.close();
          resolve(fs.createReadStream(fileName));
        });
        writer.on("error", reject);
      });

      // const downloadUrl = `${url}?token=${token}&initiator=${initiator}&filename=${fileName}`;
      // let file = fs.createWriteStream(fileName);
      // const { data } = await this.httpService
      //     .get<T>(url, config).pipe(file)
      //     .toPromise();
      // return { downloadUrl: url, data: data };
    } catch (error) {
      throw error;
    }
  }
  async saveFile(file: Express.Multer.File) {
    var fs = require("fs");
    let dirname = "document";
    let filePath = `${__dirname}/../../upload/`;
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath);
    }
    var dir = filePath + dirname;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    let filenewname = Date.now() + "_" + file.originalname;
    let filename = dir + "/" + filenewname;
    console.log(filename);
    const writeStream = fs.createWriteStream(filename);
    writeStream.write(file.buffer);
    writeStream.end();
    let getfile = config.get("getfile");
    return {
      statusCode: 200,
      filename: filenewname,
      url: getfile.url + filenewname
    };
  }
  getFile(filename) {
    var fs = require("fs");
    let dirname = "document";
    let filePath = `${__dirname}/../../upload/`;
    var dir = filePath + dirname;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    filename = dir + "/" + filename;
    if (fs.existsSync(filename)) {
      return {
        statusCode: 200,
        filename: filename
      };
    } else {
      return {
        statusCode: 500,
        filename: "Không tồn tại file!"
      };
    }
  }
}
