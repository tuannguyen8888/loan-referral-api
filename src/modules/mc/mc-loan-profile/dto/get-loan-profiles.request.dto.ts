import { IsString, IsNumber, IsOptional, IsDefined } from "class-validator";

export class GetMCLoanProfilesRequestDto {
  // @IsNumber()
  // @IsOptional()
  // partner_id?: number;

  @IsOptional()
  shopCode?: string;
  @IsOptional()
  saleCode?: string;
  @IsOptional()
  mobileProductType?: string;

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
