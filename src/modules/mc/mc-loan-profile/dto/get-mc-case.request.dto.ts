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

export class GetMcCaseRequestDto {
  pageNumber: number;
  pageSize: number;
  keyword: string;
  status: string;
  saleCode: string;
}
