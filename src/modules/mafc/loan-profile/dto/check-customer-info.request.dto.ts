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

export class CheckCustomerInfoRequestDto {
  @IsNumberString()
  customer_national_id: string;

  @IsNumberString()
  phone: string;

  @IsOptional()
  tax_code?: string;

  user_id: string;
}
