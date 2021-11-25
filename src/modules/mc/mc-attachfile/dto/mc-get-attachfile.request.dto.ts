import { IsString, IsNumber, IsOptional, IsDefined } from "class-validator";

export class GetMCAttachfileRequestDto {
  // @IsNumber()
  // @IsOptional()
  // partner_id?: number;

  @IsOptional()
  profileid: number;

  @IsOptional()
  documentCode: string;

  @IsOptional()
  groupId: number;

  @IsDefined()
  @IsString()
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
