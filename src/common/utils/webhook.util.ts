import * as axios from "axios";
import { Injectable, HttpService, HttpException } from "@nestjs/common";
import { Logger } from "src/common/loggers";
import { WebhookEventPayload } from "src/common/interfaces/resources";

@Injectable()
export class WebhookUtil {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: Logger
  ) {}

  async post<T>(
    url: string,
    body: WebhookEventPayload,
    config?: axios.AxiosRequestConfig
  ): Promise<T> {
    try {
      const { data } = await this.httpService
        .post<T>(url, body, config)
        .toPromise();
      this.logger.verbose(
        `Sent to webhook - URL: ${url} - Data: ${JSON.stringify(
          body
        )} - Result: ${JSON.stringify(data)}`
      );
      return data;
    } catch (error) {
      // this.logger.logException(WEBHOOK_SERVER_ERROR, { error, url, body });
      // throw new HttpException(
      //   WEBHOOK_SERVER_ERROR.message,
      //   WEBHOOK_SERVER_ERROR.code,
      // );
    }
  }
}
