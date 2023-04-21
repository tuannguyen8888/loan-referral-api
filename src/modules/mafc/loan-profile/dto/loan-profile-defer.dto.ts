import { IsDateString, IsOptional } from "class-validator";
import { DeferReplyDto } from "./loan-profile-defer-reply.request.dto";

export class LoanProfileDeferDto {
  id: number = null;
  loan_profile_id: number = null;
  id_f1: string = null;
  client_name: string = null;
  defer_code: string = null;
  defer_note: string = null;
  @IsOptional()
  reply_comment: string = null;
  defer_time: Date = null;
  status: string = null;
  @IsOptional()
  @IsDateString()
  created_at: string = null;
  created_by: string = null;
  @IsOptional()
  @IsDateString()
  updated_at: string = null;
  updated_by: string = null;
  @IsOptional()
  @IsDateString()
  deleted_at: string = null;
  deleted_by: string = null;

  @IsOptional()
  details: DeferReplyDto[] = [];
}
