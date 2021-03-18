import * as axios from "axios";
import * as FormData from "form-data";
import { HttpService, Inject, Injectable } from "@nestjs/common";
import { DownloadFileResParam } from "../interfaces/response";
import * as fs from "fs";

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
      config.timeoutErrorMessage =
        "Timeout roi cha noi, api gi ma cham qua vay";
      console.log("call partner api: ", url);
      console.log("body = ", body);
      const { data } = await this.httpService
        .post<T>(url, body, config)
        .toPromise();
      console.log("api result data = ", data);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async uploadFile<T>(url: string, formData: FormData, auth = null): Promise<T> {
    try {
      let config: any = { headers: formData.getHeaders() };
      if(auth){
          config.auth = auth;
      }
      const { data } = await this.httpService
        .post<T>(url, formData, config)
        .toPromise();
      return data;
    } catch (error) {
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
    ): Promise<any> {
        try {
            const writer = fs.createWriteStream(fileName);

            const response = await this.httpService.axiosRef({
                url: url,
                method: 'GET',
                responseType: 'stream',
            });

            response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on('finish', ()=>{
                    resolve(fs.readFileSync(fileName));
                });
                writer.on('error', reject);
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
}
