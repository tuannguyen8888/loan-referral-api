import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsDefined,
  Matches
} from "class-validator";

export class AttachFileDto {
  id?: number = null;
  @IsDefined()
  loan_profile_id: number = null;
  doc_code: string = null;
  @Matches(/http[\s\S]*.[jpg,jpeg,png,pdf]/, { message: "url invalid" })
  url: string = null;
  @IsOptional()
  @IsDateString()
  created_at: string = null;
  created_by: string = null;
  @IsOptional()
  @IsDateString()
  updated_at?: string = null;
  updated_by?: string = null;
  @IsOptional()
  @IsDateString()
  deleted_at?: string = null;
  deleted_by?: string = null;
}
