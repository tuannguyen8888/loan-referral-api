import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDefined,
  Min,
  Max,
  IsNumberString
} from "class-validator";
import { BaseRequestDto } from "./base.request.dto";

export class GetLoanProfilesRequestDto extends BaseRequestDto {
  @IsNumber()
  @IsOptional()
  partner_id?: number;

  @IsNumberString()
  @IsOptional()
  loan_no?: string;

  @IsNumberString()
  @IsOptional()
  fv_status?: string;

  @IsNumberString()
  @IsOptional()
  loan_status?: string;

  @IsNumberString()
  @IsOptional()
  name?: string;
}
