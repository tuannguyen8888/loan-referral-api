import { IsDateString, IsOptional } from "class-validator";

export class LoanProfileDeferReplyRequestDto {
  defer_id: number = null;
  @IsOptional()
  reply_comment?: string = null;
  details: DeferReplyDto[] = [];
}

export class DeferReplyDto{
    doc_code: string = null;
    url: string = null;
}