import { Injectable } from "@nestjs/common";
import { WebhookUtil } from "src/common/utils";
import { TransactionType } from "src/common/enums";
import { MessageType, EwalletState } from "src/common/modules/webhook/enums";
// import { BaseService } from "src/common/services";
// import { PartnerRepository } from "src/common/repositories";
import { transformObjectKeysToCamelCase } from "src/common/helpers";
import { Partner, WebhookEventPayload } from "src/common/interfaces";
import {
  MessageBody,
  EwalletKycMessage,
  LinkBankMessage
} from "src/common/modules/webhook/interfaces";

// import { oeco_module_user } from "src/grpc/generated";

@Injectable()
export class WebhookService {
  constructor(
    // protected readonly tenantRepository: PartnerRepository,
    private readonly webhookUtil: WebhookUtil
  ) {
    // super();
  }

  private async getPartner(merchant: string): Promise<Partner> {
    // const partner = await this.queryRepository.partner.findOne({
    //   partner_code: merchant
    // });
    // const parsedPartner: Partner = transformObjectKeysToCamelCase(partner).doc;
    return null;
  }

  private send(url: string, payload: WebhookEventPayload): Promise<unknown> {
    return this.webhookUtil.post(url, payload);
  }

  sendNewRegistrationNotification(): // webhookInfo: oeco_module_user.WebhookInfo
  Promise<unknown> {
    const { partner, initiator } = { partner: null, initiator: null }; //webhookInfo;
    const message = `Account number ${initiator.walletAccount} registered successfully`;
    const payload: WebhookEventPayload = {
      type: TransactionType.REGISTRATION,
      result: 1,
      message,
      data: initiator
    };
    return this.send(partner.webhookLink, payload);
  }

  sendChangePinNotification(
    // webhookInfo: oeco_module_user.WebhookInfo,
    result: boolean
  ): Promise<unknown> {
    const { partner, initiator } = { partner: null, initiator: null }; //webhookInfo;
    const message = result
      ? `Account number ${initiator.walletAccount} changed PIN successfully`
      : `Account number ${initiator.walletAccount} Change PIN failed`;
    const payload: WebhookEventPayload = {
      type: TransactionType.CHANGE_PIN,
      result: result ? 1 : 0,
      message,
      data: initiator
    };
    return this.send(partner.webhookLink, payload);
  }

  sendNotification(messageBody: MessageBody): Promise<unknown> {
    switch (messageBody.type) {
      case MessageType.EWALLET_APPROVAL:
        return this.sendEwalletKycStatus(messageBody);

      case MessageType.LINK_BANK:
        return this.sendLinkBankStatus(messageBody);
    }
  }

  private async sendEwalletKycStatus(
    messageBody: EwalletKycMessage
  ): Promise<any> {
    let message: string;
    let result: number;
    const partner = await this.getPartner(messageBody.merchant);
    switch (messageBody.ewallet_state) {
      case EwalletState.VERIFIED:
        message = `Account number ${messageBody.reference}'s KYC approved`;
        result = 1;
        break;

      case EwalletState.REJECTED:
        message = `Account number ${messageBody.reference}'s KYC rejected`;
        result = 0;
        break;
    }

    const payload: WebhookEventPayload = {
      type: TransactionType.REGISTRATION,
      result,
      message,
      data: messageBody
    };
    return this.send(partner.webHookLink, payload);
  }

  private async sendLinkBankStatus(messageBody: LinkBankMessage): Promise<any> {
    let message: string;
    let result: number;
    const partner = await this.getPartner(messageBody.source_merchant);
    switch (messageBody.success) {
      case true:
        message = `Account number ${messageBody.reference}'s links bank successfully`;
        result = 1;
        break;

      case false:
        message = `Account number ${messageBody.reference}'s links bank failed`;
        result = 0;
        break;
    }

    const payload: WebhookEventPayload = {
      type: TransactionType.LINK_BANK,
      result,
      message,
      data: messageBody
    };
    return this.send(partner.webHookLink, payload);
  }
}
