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

  @IsOptional()
  fv_status?: string;

  @IsOptional()
  loan_status?: string;

}
