import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDefined,
  Min,
  Max,
  IsNumberString,
  IsJSON
} from "class-validator";

export class BaseRequestDto {
  @IsDefined()
  export: boolean;

  @IsDefined()
  exportView: boolean;

  @IsDefined()
  @IsString()
  keyword: string;

  @IsDefined()
  @IsNumber()
  page: number;

  @IsDefined()
  @IsNumber()
  pagesize: number;

  @IsDefined()
  sort: any;
}
