import {
  Source,
  MessageType,
  EwalletState
} from "src/common/modules/webhook/enums";

export interface MessageBody {
  type: MessageType;
  source: Source;
  reference: string;
}

export interface EwalletKycMessage extends MessageBody {
  ewallet_state?: EwalletState;
  merchant?: string;
}

export interface LinkBankMessage extends MessageBody {
  source_merchant?: string;
  success?: boolean;
  message?: string;
  bank_code?: string;
  bank_name?: string;
  card_number?: string;
}
