import {
  IsString,
  IsNumber,
  IsOptional,
  IsDefined,
} from "class-validator";

export class GetPtfLoanProfilesRequestDto{
  @IsNumber()
  @IsOptional()
  partner_id?: number;

  @IsOptional()
  fv_status?: string;

  @IsOptional()
  loan_status?: string;

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
