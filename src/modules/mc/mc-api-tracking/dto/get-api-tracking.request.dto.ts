import { IsString, IsNumber, IsOptional, IsDefined } from "class-validator";

export class GetMCApiTrackingRequestDto {
  // @IsNumber()
  // @IsOptional()
  // partner_id?: number;

  @IsOptional()
  keyword: string;
  @IsOptional()
  createfrom?: string;
  @IsOptional()
  createto?: string;
  @IsOptional()
  primaryPhone?: string;
  @IsOptional()
  user_id: string;
  @IsOptional()
  sortcol: string;
  @IsOptional()
  sorttype: string;
}
