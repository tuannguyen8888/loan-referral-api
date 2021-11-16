import { IsString, IsNumber, IsOptional, IsDefined } from "class-validator";

export class GetMCCicResultRequestDto {
  // @IsNumber()
  // @IsOptional()
  // partner_id?: number;

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

  user_id: string;
}
