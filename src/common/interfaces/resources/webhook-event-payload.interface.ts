import { TransactionType } from "src/common/enums";

export interface WebhookEventPayload {
  type: TransactionType;
  result: number;
  message: string;
  data: unknown;
}
