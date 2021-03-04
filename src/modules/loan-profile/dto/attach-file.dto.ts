import {IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString, IsDefined} from "class-validator";

export class AttachFileDto {
  id?: number;
  @IsDefined()
  loan_profile_id: number;
  doc_code: string;
  @IsOptional()
  @IsDateString()
  created_at: string;
  created_by: number;
  @IsOptional()
  @IsDateString()
  updated_at?: string;
  updated_by?: number;
  @IsOptional()
  @IsDateString()
  deleted_at?: string;
  deleted_by?: number;
}
