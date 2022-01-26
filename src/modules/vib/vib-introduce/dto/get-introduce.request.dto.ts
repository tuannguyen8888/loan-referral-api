import { IsString, IsNumber, IsOptional, IsDefined } from "class-validator";

export class GetVibIntroduceRequestDto {
  // @IsNumber()
  // @IsOptional()
  // partner_id?: number;
  @IsOptional()
  source: string = null;
  @IsOptional()
  introduceby: string = null;
  @IsOptional()
  customername: string = null;
  @IsOptional()
  customerphone: string = null;
  @IsOptional()
  regisdatefrom: number;
  @IsOptional()
  regisdateto: number;
  @IsOptional()
  cardtype: string;
  @IsOptional()
  statuslead: string;
  @IsOptional()
  statusapproval: string;
  @IsOptional()
  paid: number;
  @IsOptional()
  keyword: string;
  @IsOptional()
  user_id: string;
}
