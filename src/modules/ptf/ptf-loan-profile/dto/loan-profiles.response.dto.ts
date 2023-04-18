import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDefined,
  Min
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { LoanProfileResponseDto } from "./loan-profile.response.dto";

export class LoanProfilesResponseDto {
  rows: LoanProfileResponseDto[];

  count: number;
}
