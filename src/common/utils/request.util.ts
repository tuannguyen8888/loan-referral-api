import * as axios from 'axios';
import * as FormData from 'form-data';
import { HttpService, Inject, Injectable } from '@nestjs/common';
import {DownloadFileResParam} from "../interfaces/response";

@Injectable()
export class RequestUtil {
  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    // @Inject(FVBackendConfigProvider) private readonly config: FVBackendConfig,
  ) {}

  async post<T>(url: string, body: unknown, config?: axios.AxiosRequestConfig): Promise<T> {
    try {
      const { data } = await this.httpService
        .post<T>(url, body, config)
        .toPromise();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async uploadFile<T>(url: string, formData: FormData): Promise<T> {
    try {
      const { data } = await this.httpService
        .post<T>(url, formData, { headers: formData.getHeaders() })
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
    config?: axios.AxiosRequestConfig,
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
}
