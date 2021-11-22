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

  @IsOptional()
  cicResult?: number;
  @IsOptional()
  status?: string;
  @IsOptional()
  bpmStatus?: string;
  @IsOptional()
  completedatfrom?: string;
  @IsOptional()
  completedatto?: string;
  @IsOptional()
  checkcontract?: string;

  @IsOptional()
  keyword: string;

  @IsDefined()
  @IsNumber()
  page: number;

  @IsDefined()
  @IsNumber()
  pagesize: number;

  @IsOptional()
  sort: any;

  user_id: string;
}
