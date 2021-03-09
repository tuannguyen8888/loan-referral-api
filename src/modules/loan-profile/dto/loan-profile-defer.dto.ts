import { IsDateString, IsOptional } from "class-validator";

export class LoanProfileDeferDto {
  id: number;
  loan_profile_id: number;
  id_f1: string;
  client_name: string;
  defer_code: string;
  defer_note: string;
  defer_time: Date;
  status: string;
  @IsOptional()
  @IsDateString()
  created_at: string;
  created_by: number;
  @IsOptional()
  @IsDateString()
  updated_at: string;
  updated_by: number;
  @IsOptional()
  @IsDateString()
  deleted_at: string;
  deleted_by: number;
}
